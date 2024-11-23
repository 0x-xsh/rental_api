import { IsInt, IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateRentalDto {
  //id se cree par default
  
  @IsDate()
  @IsNotEmpty()
  rental_date: Date;

  @IsInt()
  @IsOptional()
  inventory_id: number;

  @IsInt()
  @IsNotEmpty()
  customer_id: number;
  
  @IsNotEmpty()
  @IsDate() // Assuming this field can be NULL
  return_date?: Date;

  @IsInt()
  @IsNotEmpty()
  staff_id: number;

  @IsDate()
  last_update: Date;

  @IsString()   
  timezone?: string;
}
