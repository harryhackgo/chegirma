import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { MailService } from "../mail/mail.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { FindUserDto } from "./dto/find-user.dto";
import { Op } from "sequelize";
import { BotService } from "../bot/bot.service";
import * as otpGenerator from "otp-generator";
import { PhoneDto } from "./dto/phone-user.dto";
import { AddMinutesToDate } from "../helpers/addMinutes";
import { Otp } from "../otp/models/otp.model";
import { decode, encode } from "../helpers/crypto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { SmsService } from "../sms/sms.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Otp) private readonly otpModel: typeof Otp,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly botService: BotService,
    private readonly smsService: SmsService
  ) {}

  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("Passwords do not match");
    }
    const hashed_password = await bcrypt.hash(createUserDto.password, 7);

    const activation_link = uuid.v4();
    const newUser = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      activation_link,
    });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      throw new InternalServerErrorException("Error while sending the email");
    }

    return newUser;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }

    const updateUser = await this.userModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
        },
        returning: true,
      }
    );

    if (!updateUser[1][0]) {
      throw new BadRequestException("User is already activated");
    }
    const response = {
      message: "User has been activated successfully",
      user: updateUser[1][0].is_active,
    };
    return response;
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updateUser = await this.userModel.update(
      { hashed_refresh_token },
      {
        where: { id },
      }
    );
    return updateUser;
  }

  findAll() {
    return this.userModel.findAll();
  }

  findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUser(findUserDto: FindUserDto) {
    const { name, email, phone } = findUserDto;
    const where = {};
    if (name) {
      where["name"] = {
        [Op.iLike]: `%${name}%`,
      };
    }
    if (email) {
      where["email"] = {
        [Op.iLike]: `%${email}%`,
      };
    }
    if (phone) {
      where["phone"] = {
        [Op.iLike]: `%${phone}%`,
      };
    }

    console.log(where);

    const users = await this.userModel.findAll({ where });
    if (!users) {
      throw new NotFoundException("User is not found");
    }
    return users;
  }

  async newOtp(phoneUserDto: PhoneDto) {
    const phone_number = phoneUserDto.phone_number;

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    //-----------------------BOT---------------------------
    const isSent = await this.botService.sendOtp(`+${phone_number}`, otp);
    if (!isSent) {
      throw new BadRequestException(
        "First register in bot @hello_chegirma_bot"
      );
    }
    //-----------------------SMS----------------------------

    const response = await this.smsService.sendSMS(phone_number, otp);

    if (response.status !== 200) {
      throw new ServiceUnavailableException("Error while sending the OTP");
    }

    const message =
      `OTP code has been sent to ****` +
      phone_number.slice(phone_number.length - 4);

    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.destroy({ where: { phone_number } });
    const newOtpDate = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      phone_number,
      expiration_time,
    });

    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtpDate.id,
    };
    const encodedData = await encode(JSON.stringify(details));

    return {
      message: "Verification code was sent to the bot",
      otpMessage: message,
      verfication_key: encodedData,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, phone_number, otp } = verifyOtpDto;
    const currentDate = new Date();
    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);
    if (details.phone_number != phone_number) {
      throw new BadRequestException({
        message: "Verification code was not sent to this number",
      });
    }

    const resultOtp = await this.otpModel.findByPk(details.otp_id);

    if (resultOtp == null) {
      throw new BadRequestException({
        message: "Verification code was not found from database",
      });
    }
    if (resultOtp.verified) {
      throw new BadRequestException({
        message: "Verification code is invalid",
      });
    }
    if (resultOtp.expiration_time < currentDate) {
      throw new BadRequestException({
        message: "Verification code has expired",
      });
    }
    if (resultOtp.otp != otp) {
      throw new BadRequestException({ message: "Verification code is wrong" });
    }

    const user = await this.userModel.update(
      { is_owner: true },
      { where: { phone: `+${phone_number}` }, returning: true }
    );

    if (!user[1][0]) {
      throw new BadRequestException({
        message: "User was not found. Check the phone number",
      });
    }

    await this.otpModel.update(
      { verified: true },
      { where: { id: details.otp_id } }
    );
    return { message: "Congratulations, new boss!" };
  }
}
