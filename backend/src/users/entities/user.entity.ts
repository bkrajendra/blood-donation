import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Donation } from "../../donations/entities/donation.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mobile: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column()
  bloodGroup: string;

  @Column()
  company: string;

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

  @OneToMany(() => Donation, (donation) => donation.user)
  donations: Donation[];

  @Column({ nullable: true })
  password: string; // store hash

  @Column({ default: "bd_user" })
  role: "bd_admin" | "bd_staff" | "bd_user";
}
