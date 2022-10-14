import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class AbstractEntity implements Readonly<AbstractEntity> {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  constructor(partial: Partial<AbstractEntity>) {
    Object.assign(this, partial);
  }
}
