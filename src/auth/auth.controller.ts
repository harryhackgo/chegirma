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
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SignUpUserDto } from "./dto/signin.dto";
import { Response } from "express";
import { CookieGetter } from "../decorators/cookie-getter.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "To create a new user" })
  @ApiResponse({
    status: 201,
    description: "Registered user",
    type: String,
  })
  @Post("signup")
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: "To login to the server" })
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signIn(
    @Body() user: SignUpUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(user, res);
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
