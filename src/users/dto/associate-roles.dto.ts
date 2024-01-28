import { IsArray, IsNumber } from 'class-validator';

export class AssociateRolesDto {
  @IsArray()
  @IsNumber()
  roleIds: number[];
}
