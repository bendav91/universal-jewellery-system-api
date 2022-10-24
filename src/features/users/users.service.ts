import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { Auth0User } from 'src/interfaces/auth0-user.interface';
import { determineUserType } from 'src/utils/users/determine-user-type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async saveAuth0User(auth0User: Auth0User) {
    const userType = determineUserType(auth0User.email);

    const user = new User({
      createdAt: new Date(auth0User.created_at),
      deletedAt: null,
      email: auth0User.email,
      id: auth0User.user_id,
      lastLogin: new Date(),
      provider: 'auth0',
      updatedAt: new Date(),
      userType,
    });

    this.usersRepository.save(user);
  }
}
