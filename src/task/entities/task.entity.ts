import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
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
  
    @Column({ length: 50, default: 'PENDING' })
    status: string; // PENDING | EXECUTED 
  
    @CreateDateColumn()
    created_at: Date;
  }
  