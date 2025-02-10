import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { SignUpUserDto } from "./dto/signin.dto";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/models/user.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.findUserByEmail(
      createUserDto.email
    );
    if (candidate) {
      throw new BadRequestException("This user already exists");
    }

    const newUser = await this.usersService.create(createUserDto);
    const response = {
      message:
        "Congratulations! Thank you for signing up! Don't forget to activate your account",
      userId: newUser.id,
    };
    return response;
  }

  async signIn(user: SignUpUserDto, res: Response) {
    const foundUser = await this.usersService.findUserByEmail(user.email);

    if (!foundUser) {
      throw new BadRequestException("Email or password is wrong");
    }
    if (!foundUser.is_active) {
      throw new BadRequestException("User is not active");
    }

    const match = await bcrypt.compare(
      user.password,
      foundUser.dataValues.hashed_password
    );
    if (!match) {
      throw new BadRequestException("Email or password is wrong");
    }
    const tokens = await this.usersService.getTokens(foundUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.usersService.updateRefreshToken(
      foundUser.id,
      hashed_refresh_token
    );
    if (!updatedUser) {
      throw new InternalServerErrorException("Error while saving tokens");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "User logged in",
      userId: foundUser.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException("User is not verified");
    }

    const hashed_refresh_token = null;
    await this.usersService.updateRefreshToken(
      userData.id,
      hashed_refresh_token
    );

    res.clearCookie("refresh_token");
    const response = {
      message: "User logged out successfully",
    };
    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);

    if (userId !== decodedToken["id"]) {
      throw new ForbiddenException("Forbidden");
    }
    const user = await this.usersService.findOne(userId);

    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException("User not found");
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token
    );

    if (!tokenMatch) {
      throw new ForbiddenException("Forbidden");
    }

    const tokens = await this.usersService.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.usersService.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "User refreshed",
      user: user.id,
      access_token: tokens.access_token,
    };

    return response;
  }
}
