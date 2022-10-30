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
import { Auth0UserDto } from 'src/dtos/auth/auth0-user.dto';

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

  async saveAuth0User(auth0User: Auth0UserDto) {
    const emailDomains = this.configService.get<string>('STAFF_EMAIL_DOMAINS');
    const userType = determineUserType(auth0User.user.email, emailDomains);

    let existingUser = await this.usersRepository.findOne({
      where: { id: auth0User.user.user_id },
    });

    const userExistsAndNoPaymentIdOrNoUser =
      (existingUser && !existingUser?.paymentGatewayCustomerId) ||
      !existingUser;

    let stripeCustomer: Stripe.Customer | undefined;

    if (userExistsAndNoPaymentIdOrNoUser) {
      stripeCustomer = await this.createStripeCustomerWithUser(auth0User.user);
      existingUser = {
        ...existingUser,
        paymentGatewayCustomerId: stripeCustomer.id,
      };
    } else {
      await this.updateStripeCustomerWithUser(
        auth0User.user,
        existingUser.paymentGatewayCustomerId,
      );
    }

    const user = new User({
      ...existingUser,
      deletedAt: null,
      email: auth0User.user.email,
      id: auth0User.user.user_id,
      lastLogin: new Date(),
      provider: 'auth0',
      userType,
    });

    this.usersRepository.save(user);
  }

  private async createStripeCustomerWithUser(
    auth0user: Auth0User,
  ): Promise<Stripe.Customer> {
    try {
      const stripeCustomer = await this.stripeService.customers.create({
        email: auth0user.email,
        name: auth0user.name,
        metadata: {
          userId: auth0user.user_id,
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

  private async updateStripeCustomerWithUser(
    auth0user: Auth0User,
    paymentCustomerId: string,
  ): Promise<Stripe.Customer> {
    try {
      const stripeCustomer = await this.stripeService.customers.update(
        paymentCustomerId,
        {
          email: auth0user.email,
          name: auth0user.name,
          metadata: {
            userId: auth0user.user_id,
          },
        },
      );
      return stripeCustomer;
    } catch (error) {
      this.logger.error(error);
      throw new ServiceUnavailableException(
        'Unable to update payment customer',
      );
    }
  }
}
