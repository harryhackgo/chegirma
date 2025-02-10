import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Admin } from "./models/admin.model";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    private readonly jwtService: JwtService
  ) {}

  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      is_creator: admin.is_creator,
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

  async create(createAdminDto: CreateAdminDto) {
    try {
      this.findByEmail(createAdminDto.email);
      const newUser = await this.adminModel.create(createAdminDto);
      return newUser;
    } catch (error) {
      if (error.message == "Admin was not found")
        error.messaage = "Admin with this email already exists";
      throw error;
    }
  }

  async findAll() {
    return await this.adminModel.findAll({
      attributes: { exclude: ["password"] },
    });
  }

  async findOne(id: number) {
    return await this.adminModel.findByPk(id);
  }

  async findByEmail(email: string) {
    const admin = await this.adminModel.findOne({
      where: { email },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!admin) throw new BadRequestException("Admin was not found");
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const oldUser = await this.adminModel.findByPk(id);
    if (!oldUser)
      throw new BadRequestException("Admin with this id was not found");
    const updatedUser = await oldUser.update(updateAdminDto);
    return updatedUser;
  }

  async remove(id: number) {
    const admin = await this.adminModel.findByPk(id);
    admin?.destroy();
    return { message: "Admin was destroyed successfully" };
  }
}
