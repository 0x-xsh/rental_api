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

@Module({
  imports: [
    TypeOrmModule.forRoot({
       type: 'postgres',
      host: process.env.DATABASE_HOST, 
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER ,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME, 
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
