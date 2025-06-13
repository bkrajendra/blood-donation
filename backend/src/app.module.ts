import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DonationsModule } from './donations/donations.module';
import { User } from './users/entities/user.entity';
import { Donation } from './donations/entities/donation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'blood_donation.db',
      entities: [User, Donation],
      synchronize: true,
    }),
    UsersModule,
    DonationsModule,
  ],
})
export class AppModule {}