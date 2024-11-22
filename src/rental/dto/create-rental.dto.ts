import { IsInt, IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateRentalDto {
  @IsInt()
  @IsNotEmpty()
  rental_id: number;

  @IsDate()
  @IsNotEmpty()
  rental_date: Date;

  @IsInt()
  @IsNotEmpty()
  inventory_id: number;

  @IsInt()
  @IsNotEmpty()
  customer_id: number;

  @IsDate()
  @IsOptional() // Assuming this field can be NULL
  return_date?: Date;

  @IsInt()
  @IsNotEmpty()
  staff_id: number;

  @IsDate()
  @IsNotEmpty()
  last_update: Date;

  @IsString()
  @IsOptional() // Assuming this field can be NULL
  timezone?: string;
}
