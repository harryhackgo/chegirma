import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SignUpAdminDto } from "./dto/signin.dto";
import { Response } from "express";
import { CookieGetter } from "../decorators/cookie-getter.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "To create a new admin" })
  @ApiResponse({
    status: 201,
    description: "Registered admin",
    type: String,
  })
  @Post("signup")
  signUp(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.signUp(createAdminDto);
  }

  @ApiOperation({ summary: "To login to the server" })
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signIn(
    @Body() admin: SignUpAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(admin, res);
  }

  @ApiOperation({ summary: "To logout from the server" })
  @HttpCode(200)
  @Post("signout")
  signout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  @ApiOperation({ summary: "To refresh the token" })
  @HttpCode(200)
  @Post(":id/refresh")
  refresh(
    @Param("id") id: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
