import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity'; // Task entity
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // Register the TaskRepository
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService], // Export TaskService for use in other modules
})
export class TaskModule {}
