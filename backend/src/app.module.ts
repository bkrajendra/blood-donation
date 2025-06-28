import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DonationsModule } from './donations/donations.module';
import { User } from './users/entities/user.entity';
import { Donation } from './donations/entities/donation.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '/data/blood_donation.db',
      entities: [User, Donation],
      synchronize: true,
    }),
    UsersModule,
    DonationsModule,
    AuthModule
  ],
})
export class AppModule {}