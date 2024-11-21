import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from './task.service';

@Injectable()
export class TaskScheduler {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Run every hour to fetch and execute tasks for the current day
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyTaskProcessing(): Promise<void> {
    await this.taskService.fetchAndExecuteTasksForToday();
  }
}
