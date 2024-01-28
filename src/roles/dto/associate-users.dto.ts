import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class AssociateUsersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  user_ids: number[];
}
