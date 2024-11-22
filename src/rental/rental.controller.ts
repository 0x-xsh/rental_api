import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RentalService } from './rental.service';
import { Rental } from './entities/rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}
  @Post()
  async createRental(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return this.rentalService.createRental(createRentalDto);
  }


}
