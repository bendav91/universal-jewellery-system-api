import { UserType } from 'src/constants/users/user-type.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User implements Readonly<User> {
  @PrimaryColumn({
    type: 'varchar',
    length: 80,
  })
  public id: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CUSTOMER,
    enumName: 'userTypeEnum',
  })
  public userType: UserType;

  @Column({ type: 'varchar', length: 80 })
  public provider: string;

  @Column({ type: 'timestamp' })
  public lastLogin: Date;

  @Column({ unique: true })
  public email: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
