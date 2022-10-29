import { UserDto } from 'src/dtos/users/user.dto';
import { User } from 'src/entities/users/user.entity';

export const resolveUserDto = (user: User): UserDto | null => {
  return user
    ? new UserDto({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      })
    : null;
};
