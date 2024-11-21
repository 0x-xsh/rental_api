import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Store } from 'src/store/entities/store.entity';
import { Address } from 'src/address/entities/address.entity';
import { City } from 'src/city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}


  async findCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customer_id: id },
      relations: ['address', 'address.city', 'address.city.country'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

 
  async create(customerData: CreateCustomerDto): Promise<Customer> {
    const store = await this.storeRepository.findOne({ where: { store_id: customerData.store_id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const customer = this.customerRepository.create({
      ...customerData,
      store,
    });

    return this.customerRepository.save(customer);
  }


  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findCustomerById(id);

    // Update basic customer fields
    if (updateCustomerDto.first_name) customer.first_name = updateCustomerDto.first_name;
    if (updateCustomerDto.last_name) customer.last_name = updateCustomerDto.last_name;
    if (updateCustomerDto.email) customer.email = updateCustomerDto.email;

    // Update address if provided
    if (this.hasAddressFields(updateCustomerDto)) {
      customer.address = await this.updateCustomerAddress(customer.address, updateCustomerDto);
    }

    return this.customerRepository.save(customer);
  }


  private async updateCustomerAddress(
    address: Address | null,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Address> {
    if (!address) {
      throw new NotFoundException('Customer address not found');
    }

    // Update address fields
    if (updateCustomerDto.address) address.address = updateCustomerDto.address;
    if (updateCustomerDto.district) address.district = updateCustomerDto.district;
    if (updateCustomerDto.postal_code) address.postal_code = updateCustomerDto.postal_code;
    if (updateCustomerDto.phone) address.phone = updateCustomerDto.phone;

    // Update city and country if provided
    if (updateCustomerDto.city || updateCustomerDto.country) {
      address.city = await this.updateCityAndCountry(updateCustomerDto.city, updateCustomerDto.country);
    }

    return this.addressRepository.save(address);
  }

 
  private async updateCityAndCountry(cityName?: string, countryName?: string): Promise<City> {
    if (!cityName) {
      throw new NotFoundException('City name is required for updating the city');
    }

    const city = await this.cityRepository.findOne({
      where: { name: cityName },
      relations: ['country'],
    });

    if (!city) {
      throw new NotFoundException(`City with name ${cityName} not found`);
    }

    // Update country if provided
    if (countryName && city.country.country !== countryName) {
      const country = await this.countryRepository.findOne({ where: { country: countryName } });

      if (!country) {
        throw new NotFoundException(`Country with name ${countryName} not found`);
      }

      city.country = country;
      await this.cityRepository.save(city);
    }

    return city;
  }

 
  private hasAddressFields(updateCustomerDto: UpdateCustomerDto): boolean {
    const { address, district, postal_code, phone, city, country } = updateCustomerDto;
  
    //added true and false for readability, using !! isn't very readable in less than 3s but i might start using it in prod.
    return (address && district && postal_code && phone && city && country) ? true : false;


  }
  
}
