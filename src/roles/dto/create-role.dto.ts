import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(255)
  description: string;
}
