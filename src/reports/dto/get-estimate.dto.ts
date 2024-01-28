import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsOptional()
  @IsString()
  make: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsOptional()
  @IsLongitude()
  longitude: number;

  @IsOptional()
  @IsLatitude()
  latitude: number;
}
