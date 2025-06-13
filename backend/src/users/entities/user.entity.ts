import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Donation } from '../../donations/entities/donation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mobile: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column()
  bloodGroup: string;

  @Column()
  address: string;

  @Column({ default: false })
  hasHealthIssues: boolean;

  @Column({ nullable: true })
  healthIssueDetails: string;

  @Column({ default: false })
  isEligible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Donation, donation => donation.user)
  donations: Donation[];
}