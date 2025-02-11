import { PartialType } from "@nestjs/swagger";
import { CreateFavouriteDto } from "./create-favorite.dto";

export class UpdateFavouriteDto extends PartialType(CreateFavouriteDto) {}
