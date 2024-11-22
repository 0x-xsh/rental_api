import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsNumber()
  address_id?: number; // Optional: used to fetch the address entity

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
