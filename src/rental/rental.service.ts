import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Customer } from '../customer/entities/customer.entity';
import { Staff } from '../staff/entities/staff.entity';
import { TaskService } from '../task/task.service';
import * as dayjs from 'dayjs';


@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    private readonly taskService: TaskService, // Inject TaskService
  ) {}

  async createRental(rentalData: CreateRentalDto): Promise<Rental> {
    const rentalDate = dayjs(rentalData.rental_date);
    const returnDate = dayjs(rentalData.return_date);

    // Validate rental duration
    const rentalDuration = returnDate.diff(rentalDate, 'day');
    if (rentalDuration < 7 || rentalDuration > 21) {
      throw new BadRequestException('The rental period must be between 7 and 21 days.');
    }

    // Check customer
    const customer = await this.customerRepository.findOne({
      where: { customer_id: rentalData.customer_id, activebool: true },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${rentalData.customer_id} not found.`);
    }

    // Check staff
    const staff = await this.staffRepository.findOne({
      where: { staff_id: rentalData.staff_id },
    });
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${rentalData.staff_id} not found.`);
    }

    // Create the rental
    const rental = this.rentalRepository.create({
      rental_date: rentalData.rental_date,
      return_date: rentalData.return_date,
      customer,
      staff,
    });

    const savedRental = await this.rentalRepository.save(rental);

    // Generate tasks for the rental
    await this.createTasksForRental(savedRental);

    return savedRental;
  }

  /**
   * Create tasks for the rental
   */
  private async createTasksForRental(rental: Rental): Promise<void> {
    if (!rental.customer.timezone) {
      throw new BadRequestException(
        `Customer associated with Rental ID ${rental.rental_id} does not have a timezone.`,
      );
    }
  
    const clientTimezone = rental.customer.timezone; // e.g., 'UTC-8'
  
    // Use dayjs to handle the return date
    const returnDate = dayjs(rental.return_date);
  
    // Helper function to convert to UTC at 12 PM client time
    const getMiddayInUTC = (daysBefore: number): Date => {
      // Adjust return date to client's timezone
      const localMidday = returnDate
        .subtract(daysBefore, 'day') // Go back `daysBefore` days
        .hour(12) // Set to 12 PM client time
        .minute(0)
        .second(0)
        .millisecond(0);
  
      // Convert to UTC based on the client's timezone offset
      const offsetMatch = clientTimezone.match(/UTC([+-]\d{1,2})/);
      if (!offsetMatch) {
        throw new BadRequestException(
          `Invalid timezone format for customer: ${clientTimezone}. Use format "UTC±[hh]".`,
        );
      }
      const offsetHours = parseInt(offsetMatch[1], 10);
  
      // Adjust the local midday time to UTC
      return localMidday.add(-offsetHours, 'hour').toDate();
    };
  
    // Task 1: 5 days before return date
    const D5LocalMiddayUTC = getMiddayInUTC(5);
  
    // Task 2: 3 days before return date
    const D3LocalMiddayUTC = getMiddayInUTC(3);
  
    // Create tasks
    const taskD5 = {
      rental_id: rental.rental_id,
      task_type: 'REMINDER_EMAIL_D5',
      execution_time_utc: D5LocalMiddayUTC,
    };
  
    const taskD3 = {
      rental_id: rental.rental_id,
      task_type: 'REMINDER_EMAIL_D3',
      execution_time_utc: D3LocalMiddayUTC,
    };
  
    // Save tasks
    await this.taskService.createTask(taskD5);
    await this.taskService.createTask(taskD3);
  }
  
}
