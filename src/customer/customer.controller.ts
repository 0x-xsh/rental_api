import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';


@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  

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