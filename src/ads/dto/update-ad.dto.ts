import { PartialType } from "@nestjs/swagger";
import { CreateAdsDto } from "./create-ad.dto";

export class UpdateAdsDto extends PartialType(CreateAdsDto) {}
