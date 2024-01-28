import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(255)
  description: string;
}
