// import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
// import { StaffService } from './staff.service';
// import { Staff } from './entities/staff.entity';

// @Controller('staff')
// export class StaffController {
//   constructor(private readonly staffService: StaffService) {}

//   @Get()
//   findAll(): Promise<Staff[]> {
//     return this.staffService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number): Promise<Staff> {
//     return this.staffService.findOne(id);
//   }

//   @Post()
//   create(@Body() staffData: Partial<Staff>): Promise<Staff> {
//     return this.staffService.create(staffData);
//   }

//   @Put(':id')
//   update(@Param('id') id: number, @Body() staffData: Partial<Staff>): Promise<Staff> {
//     return this.staffService.update(id, staffData);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: number): Promise<void> {
//     return this.staffService.delete(id);
//   }
// }
