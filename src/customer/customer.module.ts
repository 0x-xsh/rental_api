import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { Store } from '../store/entities/store.entity'
import { Address } from 'src/address/entities/address.entity';
import { AddressService } from 'src/address/address.service';
import { City } from 'src/city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, City, Country, Customer, Store])],
  providers: [CustomerService, AddressService],
  controllers: [CustomerController],
  exports: [CustomerService, AddressService],
})
export class CustomerModule { }