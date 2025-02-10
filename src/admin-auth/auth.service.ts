import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { SignUpAdminDto } from "./dto/signin.dto";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../admin/admin.service";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(createAdminDto: CreateAdminDto) {
    const candidate = await this.adminService.findByEmail(createAdminDto.email);
    if (candidate) {
      throw new BadRequestException("This admin already exists");
    }

    const newAdmin = await this.adminService.create(createAdminDto);
    const response = {
      message:
        "Congratulations! Thank you for signing up! Don't forget to activate your account",
      adminId: newAdmin.id,
    };
    return response;
  }

  async signIn(admin: SignUpAdminDto, res: Response) {
    const foundAdmin = await this.adminService.findByEmail(admin.email);

    if (!foundAdmin) {
      throw new BadRequestException("Email or password is wrong");
    }

    const tokens = await this.adminService.getTokens(foundAdmin);

    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "Admin logged in",
      adminId: foundAdmin.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!adminData) {
      throw new ForbiddenException("Admin is not verified");
    }

    res.clearCookie("refresh_token");
    const response = {
      message: "Admin logged out successfully",
    };
    return response;
  }

  async refreshToken(adminId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);

    if (adminId !== decodedToken["id"]) {
      throw new ForbiddenException("Forbidden");
    }
    const admin = await this.adminService.findOne(adminId);

    const tokens = await this.adminService.getTokens(admin!);

    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "Admin refreshed",
      admin: admin!.id,
      access_token: tokens.access_token,
    };

    return response;
  }
}
