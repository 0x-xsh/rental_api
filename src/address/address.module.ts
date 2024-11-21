import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
// import { AddressController } from './address.controller';
import { Address } from './entities/address.entity';
import { City } from 'src/city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, City, Country])],
  providers: [AddressService],
  // controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule { }
