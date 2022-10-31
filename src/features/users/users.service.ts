import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { determineUserType } from 'src/utils/users/determine-user-type';
import { Repository } from 'typeorm';
import { Stripe } from 'stripe';
import { Auth0UserRequestDto } from 'src/dtos/auth/auth0-user.dto';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
  ) {}

  async saveAuth0User(auth0UserRequest: Auth0UserRequestDto) {
    const emailDomains = this.configService.get<string>('STAFF_EMAIL_DOMAINS');
    const userType = determineUserType(
      auth0UserRequest.user.email,
      emailDomains,
    );

    let existingUser = await this.usersRepository.findOne({
      where: { id: auth0UserRequest.user.user_id },
    });

    const userExistsAndNoPaymentIdOrNoUser =
      (existingUser && !existingUser?.paymentGatewayCustomerId) ||
      !existingUser;

    let stripeCustomer: Stripe.Customer | undefined;

    if (userExistsAndNoPaymentIdOrNoUser) {
      stripeCustomer = await this.stripeService.createStripeCustomerWithUser(
        auth0UserRequest,
      );
      existingUser = {
        ...existingUser,
        paymentGatewayCustomerId: stripeCustomer.id,
      };
    } else {
      await this.stripeService.updateStripeCustomerWithUser(
        auth0UserRequest,
        existingUser.paymentGatewayCustomerId,
      );
    }

    const user = new User({
      ...existingUser,
      deletedAt: null,
      email: auth0UserRequest.user.email,
      id: auth0UserRequest.user.user_id,
      lastLogin: new Date(),
      provider: 'auth0',
      userType,
    });

    this.usersRepository.save(user);
  }
}
