import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation, DonationStatus } from './entities/donation.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationStatusDto } from './dto/update-donation-status.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    private usersService: UsersService,
  ) {}

  async create(createDonationDto: CreateDonationDto): Promise<Donation> {
    const user = await this.usersService.findOne(createDonationDto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${createDonationDto.userId} not found`);
    }

    const donation = this.donationRepository.create(createDonationDto);
    return this.donationRepository.save(donation);
  }

  async updateStatus(id: number, updateStatusDto: UpdateDonationStatusDto): Promise<Donation> {
    const donation = await this.donationRepository.findOne({ 
      where: { id },
      relations: ['user']
    });
    
    if (!donation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }

    donation.status = updateStatusDto.status;
    donation.notes = updateStatusDto.notes;
    
    return this.donationRepository.save(donation);
  }

  async findAll(): Promise<Donation[]> {
    return this.donationRepository.find({ relations: ['user'] });
  }

  async getStatistics() {
    const total = await this.donationRepository.count();
    const donated = await this.donationRepository.count({ 
      where: { status: DonationStatus.DONATED } 
    });
    const rejected = await this.donationRepository.count({ 
      where: { status: DonationStatus.REJECTED } 
    });
    const pending = await this.donationRepository.count({ 
      where: { status: DonationStatus.PENDING } 
    });

    return {
      total,
      donated,
      rejected,
      pending,
      donationRate: total > 0 ? Math.round((donated / total) * 100) : 0
    };
  }

  async findByUserId(userId: number): Promise<Donation[]> {
    return this.donationRepository.find({ 
      where: { userId },
      relations: ['user']
    });
  }
}