import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { Auth0User } from 'src/interfaces/auth0-user.interface';
import { determineUserType } from 'src/utils/users/determine-user-type';
import { Repository } from 'typeorm';
import { Stripe } from 'stripe';

@Injectable()
export class UsersService {
  private readonly stripeService: Stripe;
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject('STRIPE_SERVICE') stripeService,
  ) {
    this.stripeService = stripeService;
  }

  async saveAuth0User(auth0User: Auth0User) {
    const emailDomains = this.configService.get<string>('STAFF_EMAIL_DOMAINS');
    const userType = determineUserType(auth0User.email, emailDomains);

    let existingUser = await this.usersRepository.findOne({
      where: { id: auth0User.user_id },
    });

    const userExistsAndNoPaymentIdOrNoUser =
      (existingUser && !existingUser?.paymentGatewayCustomerId) ||
      !existingUser;

    if (userExistsAndNoPaymentIdOrNoUser) {
      const stripeCustomer = await this.createStripeCustomerWithUser(auth0User);
      existingUser = {
        ...existingUser,
        paymentGatewayCustomerId: stripeCustomer.id,
      };
    }

    const user = new User({
      ...existingUser,
      deletedAt: null,
      email: auth0User.email,
      id: auth0User.user_id,
      lastLogin: new Date(),
      provider: 'auth0',
      userType,
    });

    this.usersRepository.save(user);
  }

  private async createStripeCustomerWithUser(
    user: Auth0User,
  ): Promise<Stripe.Customer> {
    try {
      const stripeCustomer = await this.stripeService.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.user_id,
        },
      });
      return stripeCustomer;
    } catch (error) {
      this.logger.error(error);
      throw new ServiceUnavailableException(
        'Unable to create payment customer',
      );
    }
  }
}
