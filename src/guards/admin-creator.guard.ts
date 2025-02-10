import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminCreatorGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const isCreator = req.admin.is_creator;

    if (isCreator) {
      throw new ForbiddenException({
        message: "You don't have rights to access",
      });
    }
    return true;
  }
}
