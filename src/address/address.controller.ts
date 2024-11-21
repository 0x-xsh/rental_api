// import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
// import { AddressService } from './address.service';
// import { Address } from './entities/address.entity';
// import { CreateAddressDto } from './dto/create-address.dto';

// @Controller('addresse')
// export class AddressController {
//   constructor(private readonly addressService: AddressService) {}

//   @Get()
//   findAll(): Promise<Address[]> {
//     return this.addressService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number): Promise<Address> {
//     return this.addressService.findOne(id);
//   }

//   @Post()
//   create(@Body() addressData: CreateAddressDto): Promise<Address> {
//     return this.addressService.createAddress(addressData);
//   }

//   @Put(':id')
//   update(@Param('id') id: number, @Body() addressData: Partial<Address>): Promise<Address> {
//     return this.addressService.update(id, addressData);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: number): Promise<void> {
//     return this.addressService.delete(id);
//   }

// }
