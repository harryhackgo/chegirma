import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { AdminGuard } from "../guards/admin.guard";
import { AdminSelfGuard } from "../guards/admin-self.guard";
import { AdminCreatorGuard } from "../guards/admin-creator.guard";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminGuard, AdminCreatorGuard)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(AdminGuard, AdminCreatorGuard)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(AdminGuard, AdminSelfGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminService.findOne(+id);
  }

  @UseGuards(AdminGuard, AdminCreatorGuard)
  @Get("email/:email")
  findByEmail(@Param("email") email: string) {
    return this.adminService.findByEmail(email);
  }

  @UseGuards(AdminGuard, AdminSelfGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @UseGuards(AdminGuard, AdminSelfGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminService.remove(+id);
  }
}
