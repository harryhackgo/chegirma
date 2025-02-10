import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserGuard } from "../guards/user.guard";
import { FindUserDto } from "./dto/find-user.dto";
import { UserSelfGuard } from "../guards/user-self.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(UserGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get("activate/:link")
  activate(@Param("link") link: string) {
    this.usersService.activate(link);
  }

  @UseGuards(UserGuard, UserSelfGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(UserGuard, UserSelfGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(UserGuard, UserSelfGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(UserGuard)
  @HttpCode(200)
  @Post("find-user")
  findUser(@Body() findUserDto: FindUserDto) {
    return this.usersService.findUser(findUserDto);
  }
}
