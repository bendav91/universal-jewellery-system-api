import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  async saveAuth0User(auth0User: Auth0User) {
    const emailDomains = this.configService.get<string>('STAFF_EMAIL_DOMAINS');

    const userType = determineUserType(auth0User.email, emailDomains);

    const user = new User({
      deletedAt: null,
      email: auth0User.email,
      id: auth0User.user_id,
      lastLogin: new Date(),
      provider: 'auth0',
      userType,
    });

    this.usersRepository.save(user);
  }
}
