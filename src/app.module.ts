import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { RentalModule } from './rental/rental.module';
import { FilmModule } from './film/film.module';
import { StoreModule } from './store/store.module';
import { AddressModule } from './address/address.module';
import { StaffModule } from './staff/staff.module';
import { CityModule } from './city/city.module';
import { CountryModule } from './country/country.module';
import { TaskModule } from './task/task.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5433,        
      username: 'postgres', 
      password: 'postgres', 
      database: 'culturedb', 
      autoLoadEntities: true, 
      synchronize: false, 
    }),
    CustomerModule, 
    RentalModule,   
    FilmModule, 
    StaffModule,
    StoreModule, 
    AddressModule,
    CityModule,
    CountryModule,
    TaskModule,
  ],
})
export class AppModule {}
