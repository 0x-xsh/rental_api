import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from 'src/country/entities/country.entity';


@Entity('city')
export class City {
  @PrimaryGeneratedColumn({})
  city_id: number;

  @Column({ type: 'varchar', length: 100, name: 'city'  })
  name: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
