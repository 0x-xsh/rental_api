import { IsNotEmpty, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  release_year?: number;

  @IsNotEmpty()
  @IsInt()
  language_id: number;

  @IsOptional()
  @IsInt()
  original_language_id?: number;

  @IsNotEmpty()
  @IsInt()
  rental_duration: number;

  @IsNotEmpty()
  @IsNumber()
  rental_rate: number;

  @IsOptional()
  @IsInt()
  length?: number;

  @IsNotEmpty()
  @IsNumber()
  replacement_cost: number;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  special_features?: string[];
}
