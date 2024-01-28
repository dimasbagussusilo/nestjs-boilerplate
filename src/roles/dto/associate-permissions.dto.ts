import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class AssociatePermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permission_ids: number[];
}
