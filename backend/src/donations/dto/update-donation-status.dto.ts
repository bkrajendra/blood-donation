import { DonationStatus } from '../entities/donation.entity';

export class UpdateDonationStatusDto {
  status: DonationStatus;
  notes?: string;
}