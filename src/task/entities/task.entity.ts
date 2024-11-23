import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  PENDING = 'PENDING',
  EXECUTED = 'EXECUTED',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rental_id: number;

  @Column({ length: 255 })
  task_type: string;

  @Column({ type: 'timestamp' })
  execution_time_utc: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @CreateDateColumn()
  created_at: Date;
}
