import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskScheduler } from './task.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), // Register Task entity
    ScheduleModule.forRoot(), // Enable scheduling
  ],
  providers: [TaskService, TaskScheduler],
})
export class TaskModule {}
