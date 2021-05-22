import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class Grade {
  @Expose()
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Expose()
  @Column({ type: 'int' })
  readonly user: number;

  @Expose()
  @Column({ type: 'int' })
  readonly experiment: number;

  @Expose()
  @Column({ type: "float" })
  readonly score: number;

  @Expose()
  @Column({ type: 'int' })
  readonly count: number;
}
