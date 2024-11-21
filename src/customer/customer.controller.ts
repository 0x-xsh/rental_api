import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';


@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Get()
  // findAll(): Promise<Customer[]> {
  //   return this.customerService.findAllCustomers();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<Customer> {
  //   const customer = await this.customerService.findCustomerById(id);
    
  //   if (!customer) {
  //     throw new NotFoundException(`Customer with ID ${id} not found`);
  //   }

  //   return customer;
  // }

  @Post()
  create(@Body() data: CreateCustomerDto): Promise<Customer>{
    return this.customerService.create(data);
  }

  @Put(':id')
  async updateCustomers(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }
}