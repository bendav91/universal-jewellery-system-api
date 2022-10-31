import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { StripeFactory } from 'src/features/stripe/stripe.factory';
import { StripeModule } from '../stripe/stripe.module';
import { UsersService } from './users.service';

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService, StripeFactory],
  exports: [UsersService],
})
export class UsersModule {}
