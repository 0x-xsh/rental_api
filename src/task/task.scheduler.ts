import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskScheduler {
  private readonly logger = new Logger(TaskScheduler.name);
  private taskSet: Set<Task> = new Set(); // In-memory set for storing tasks

  constructor(private readonly taskService: TaskService) {}

  /**
   * Run every hour to fetch and store tasks in memory
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyTaskFetching(): Promise<void> {
    this.logger.log('Fetching tasks for the next 24 hours.');
    const tasks = await this.taskService.fetchTasksForNext24Hours();
    this.taskSet.clear(); // Clear the old tasks
    tasks.forEach((task) => this.taskSet.add(task)); // Add new tasks
    this.logger.log(`Stored ${this.taskSet.size} tasks in memory.`);
  }

  /**
   * Run every minute to execute tasks within the next 5 minutes
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleMinuteLevelTaskExecution(): Promise<void> {
    const nowUTC = new Date(); // Current server time in UTC

    for (const task of this.taskSet) {
      const diffInMillis = task.execution_time_utc.getTime() - nowUTC.getTime();
      const diffInMinutes = diffInMillis / 1000 / 60;

      // If the task is due within the next 5 minutes, execute it
      if (diffInMinutes >= 0 && diffInMinutes <= 5 && task.status === 'PENDING') {
        this.logger.log(`Executing task ID ${task.id}.`);
        await this.taskService.executeTask(task);
        await this.taskService.markTaskAsExecuted(task.id);

        // Remove the task from the set to prevent re-execution
        this.taskSet.delete(task);
      }
    }
  }
}
