// import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
// import { CountryService } from './country.service';
// import { Country } from './entities/country.entity';

// @Controller('countries')
// export class CountryController {
//   constructor(private readonly countryService: CountryService) {}

//   @Get()
//   findAll(): Promise<Country[]> {
//     return this.countryService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number): Promise<Country> {
//     return this.countryService.findOne(id);
//   }

//   @Post()
//   create(@Body() countryData: Partial<Country>): Promise<Country> {
//     return this.countryService.create(countryData);
//   }

//   @Put(':id')
//   update(@Param('id') id: number, @Body() countryData: Partial<Country>): Promise<Country> {
//     return this.countryService.update(id, countryData);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: number): Promise<void> {
//     return this.countryService.delete(id);
//   }
// }
