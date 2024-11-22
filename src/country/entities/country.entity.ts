import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('country') 
export class Country {
  @PrimaryGeneratedColumn({})
  country_id: number;

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;

}
