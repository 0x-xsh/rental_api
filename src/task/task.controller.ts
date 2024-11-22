import { Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * List all scheduled tasks
   */
  @Get()
  async listAllScheduledTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  /**
   * Manually trigger a scheduled task
   */
  @Post(':id/execute')
  async manuallyTriggerTask(@Param('id') id: number) {
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      throw new BadRequestException(`Task with ID ${id} not found.`);
    }
     this.taskService.executeTask(task);
     console.log(`task with id ${id} has been successfully executed`)
  }

  /**
   * Check the execution status of a task
   */
  @Get(':id/status')
  async checkTaskStatus(@Param('id') id: number): Promise<{ id: number; status: string }> {
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      throw new BadRequestException(`Task with ID ${id} not found.`);
    }
    return { id: task.id, status: task.status };
  }
}
