import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';



@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return task;
  }


  async getScheduledTasks(): Promise<Task[]> {
    return this.taskRepository.find({
      where: { status: TaskStatus.PENDING }, // Fetch tasks with status 'PENDING'
      order: { execution_time_utc: 'ASC' }, // Optional: Order by execution time
    });
  }
  
  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      const task = this.taskRepository.create(taskData);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating task: ${error.message}`,
      );
    }}
  
  /**
   * Fetch and execute tasks for the current UTC day
   */
  async fetchTasksForNext24Hours(): Promise<Task[]> {
    const nowUTC = dayjs().utc();
    const after24hUTC = nowUTC.add(24, 'hour').toDate();
    
    const tasks = await this.taskRepository.find({
      where: {
        execution_time_utc: Between(nowUTC.toDate(), after24hUTC),
        status: TaskStatus.PENDING,
      },
    });

    this.logger.log(`Fetched ${tasks.length} tasks for the next 24 hours.`);
    return tasks;
  }

  /**
   * Execute a single task
   */
   async executeTask(task: Task): Promise<void> {
    try {
      // Add your task execution logic here (e.g., send email, notification)
      this.logger.log(`Executing task: Rental ID ${task.rental_id}, Task Type ${task.task_type}`);
    } catch (error) {
      this.logger.error(`Failed to execute task ID ${task.id}:`, error);
    }
  }

  /**
   * Mark a task as executed in the database
   */
   async markTaskAsExecuted(taskId: number): Promise<void> {
    await this.taskRepository.update(taskId, { status: TaskStatus.EXECUTED });
    this.logger.log(`Task ID ${taskId} marked as EXECUTED.`);
  }
}
