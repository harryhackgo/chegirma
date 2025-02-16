import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TelegrafException, TelegrafExecutionContext } from "nestjs-telegraf";
import { Observable } from "rxjs";
import { Context } from "telegraf";

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly ADMIN: string;
  constructor(private readonly jwtService: JwtService) {
    this.ADMIN = process.env.ADMIN!;
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();
    console.log(from!.id);
    if (Number(this.ADMIN) != from!.id) {
      throw new TelegrafException("You are not an admin. Forbidden");
    }

    return true;

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Unauthorized Admin");
    }

    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];
    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException("Unauthorized Admin");
    }

    async function verify(token: string, jwtService: JwtService) {
      let payload: any;
      try {
        payload = await jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY,
        });
      } catch (error) {
        console.log(error);
        throw new BadRequestException(error);
      }

      if (!payload) {
        throw new UnauthorizedException("Unauthorized Admin");
      }

      req.admin = payload;
      return true;
    }
    return verify(token, this.jwtService);
  }
}
