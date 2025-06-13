import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DonationStatus {
  PENDING = 'PENDING',
  DONATED = 'DONATED',
  REJECTED = 'BETTER LUCK NEXT TIME'
}

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.donations)
  user: User;

  @Column()
  userId: number;

  @Column({
    type: 'text',
    enum: DonationStatus,
    default: DonationStatus.PENDING
  })
  status: DonationStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}