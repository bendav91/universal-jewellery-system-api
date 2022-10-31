import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export const StripeFactory = {
  provide: 'STRIPE_SERVICE',
  useFactory: (configService: ConfigService): Stripe => {
    const stripeSecretKey = configService.get('STRIPE_SECRET_KEY');
    const stripeAccount = configService.get('STRIPE_ACCOUNT_ID');

    return new Stripe(stripeSecretKey, {
      typescript: true,
      apiVersion: '2022-08-01',
      stripeAccount,
    });
  },
  inject: [ConfigService],
};
