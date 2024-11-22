import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  findAll(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  findOne(id: number): Promise<Country> {
    return this.countryRepository.findOne({ where: { country_id : id} });
  }

  create(countryData: Partial<Country>): Promise<Country> {
    const country = this.countryRepository.create(countryData);
    return this.countryRepository.save(country);
  }

  update(id: number, countryData: Partial<Country>): Promise<Country> {
    return this.countryRepository.save({ id, ...countryData });
  }

  delete(id: number): Promise<void> {
    return this.countryRepository.delete(id).then(() => undefined);
  }
}
