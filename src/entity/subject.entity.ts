import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class Subject {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 20 })
  name: string;

  @Expose()
  @Column({ length: 20 })
  code: string;

  @Expose()
  @Column({ length: 6000 })
  experiments: string;
}
