import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { StripeFactory } from 'src/factories/stripe/stripe.factory';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, StripeFactory],
  exports: [UsersService],
})
export class UsersModule {}
