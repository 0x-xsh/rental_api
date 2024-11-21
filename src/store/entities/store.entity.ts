import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { Staff } from '../../staff/entities/staff.entity';

@Entity('store') 
export class Store {
  @PrimaryGeneratedColumn({ name: 'store_id' })
  store_id: number;

  @ManyToOne(() => Staff) 
  @JoinColumn({ name: 'manager_staff_id' })
  manager: Staff;

  @ManyToOne(() => Address) 
  @JoinColumn({ name: 'address_id' })
  address: Address;
 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;
}
