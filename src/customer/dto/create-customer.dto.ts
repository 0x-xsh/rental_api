import { IsString, IsEmail, IsBoolean, IsNumber, Matches } from 'class-validator';

export class CreateCustomerDto {
  
  //id se cree par default
  
  @IsString()
  first_name: string; // Required (cannot be empty)

  @IsString()
  last_name: string; // Required (cannot be empty)

  @IsEmail()
  email: string; // Required (must be a valid email)

  @IsNumber()
  store_id: number; // Required (must be a number)

  @IsBoolean()
  activebool: boolean; // Required (must be a boolean)

  @IsNumber()
  active: number; // Required (must be a number)

  @IsString()
  @Matches(/^UTC([+-](0?[0-9]|1[0-4]))$/, {
    message: 'timezone must be in the format UTC±[hh], ranging from UTC-14 to UTC+12',
  })
  timezone: string; // Required (must follow UTC±hh format)
}
