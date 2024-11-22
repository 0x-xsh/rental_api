import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';

@Entity('address') 
export class Address {
  @PrimaryGeneratedColumn({ name: 'address_id' })
  address_id: number;

  @Column({ type: 'varchar', length: 50 })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  address2: string;

  @Column({ type: 'varchar', length: 20 })
  district: string;

  @ManyToOne(() => City, { eager: true }) 
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ type: 'varchar', length: 10, nullable: true })
  postal_code: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_update' })
  last_update: Date;
}
