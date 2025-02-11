import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AdsService } from "./ads.service";
import { CreateAdsDto } from "./dto/create-ad.dto";
import { UpdateAdsDto } from "./dto/update-ad.dto";

@Controller("ads")
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  create(@Body() createAdDto: CreateAdsDto) {
    return this.adsService.create(createAdDto);
  }

  @Get()
  findAll() {
    return this.adsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdDto: UpdateAdsDto) {
    return this.adsService.update(+id, updateAdDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adsService.remove(+id);
  }
}
