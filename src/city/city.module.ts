import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityService } from './city.service';
// import { CityController } from './city.controller';
import { City } from './entities/city.entity';
import { Country } from 'src/country/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, Country])],
  providers: [CityService],
  // controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
