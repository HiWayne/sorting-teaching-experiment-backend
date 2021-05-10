import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class Experiment {
  @Expose()
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Expose()
  @Column({ length: 20 })
  readonly name: string;

  @Expose()
  @Column({ type: 'int' })
  readonly subject: number;

  @Expose()
  @Column({ length: 500 })
  readonly desc: string;

  @Expose()
  @Column({ length: 500 })
  readonly purpose: string;

  @Expose()
  @Column({ length: 500 })
  readonly require: string;
}
