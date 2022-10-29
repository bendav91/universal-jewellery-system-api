import { UserType } from 'src/constants/users/user-type.enum';
import { AbstractDto } from '../abstract/abstract.dto';

export class UserDto extends AbstractDto implements Readonly<UserDto> {
  public email: string;
  public firstName: string;
  public lastName: string;
  public userType: UserType;

  constructor({ createdAt, deletedAt, updatedAt, ...rest }: Partial<UserDto>) {
    super({ createdAt, deletedAt, updatedAt });
    Object.assign(this, rest);
  }
}
