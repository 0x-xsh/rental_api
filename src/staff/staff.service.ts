import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  findAll(): Promise<Staff[]> {
    return this.staffRepository.find({ relations: ['address', 'store'] });
  }

  findOne(id: number): Promise<Staff> {
    return this.staffRepository.findOne({ where: { staff_id: id }, relations: ['address', 'store'] });
  }

  create(staffData: Partial<Staff>): Promise<Staff> {
    const staff = this.staffRepository.create(staffData);
    return this.staffRepository.save(staff);
  }

  update(id: number, staffData: Partial<Staff>): Promise<Staff> {
    return this.staffRepository.save({ id, ...staffData });
  }

  delete(id: number): Promise<void> {
    return this.staffRepository.delete(id).then(() => undefined);
  }
}
