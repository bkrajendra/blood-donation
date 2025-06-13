import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  async findAll(year?: number): Promise<Donation[]> {
    let whereCondition = {};
    
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      whereCondition = {
        createdAt: Between(startDate, endDate)
      };
    }

    return this.donationRepository.find({ 
      where: whereCondition,
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getStatistics(year?: number) {
    let whereCondition = {};
    
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      whereCondition = {
        createdAt: Between(startDate, endDate)
      };
    }

    const total = await this.donationRepository.count({ where: whereCondition });
    const donated = await this.donationRepository.count({ 
      where: { ...whereCondition, status: DonationStatus.DONATED } 
    });
    const rejected = await this.donationRepository.count({ 
      where: { ...whereCondition, status: DonationStatus.REJECTED } 
    });
    const pending = await this.donationRepository.count({ 
      where: { ...whereCondition, status: DonationStatus.PENDING } 
    });

    return {
      total,
      donated,
      rejected,
      pending,
      donationRate: total > 0 ? Math.round((donated / total) * 100) : 0,
      year: year || 'All Time'
    };
  }

  async getAvailableYears(): Promise<number[]> {
    const result = await this.donationRepository
      .createQueryBuilder('donation')
      .select('DISTINCT strftime("%Y", donation.createdAt)', 'year')
      .orderBy('year', 'DESC')
      .getRawMany();

    return result.map(r => parseInt(r.year)).filter(year => !isNaN(year));
  }

  async findByUserId(userId: number): Promise<Donation[]> {
    return this.donationRepository.find({ 
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserDonationHistory(userId: number) {
    const donations = await this.donationRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });

    const totalDonations = donations.length;
    const successfulDonations = donations.filter(d => d.status === DonationStatus.DONATED).length;
    const rejectedDonations = donations.filter(d => d.status === DonationStatus.REJECTED).length;
    const pendingDonations = donations.filter(d => d.status === DonationStatus.PENDING).length;

    // Group by year
    const donationsByYear = donations.reduce((acc, donation) => {
      const year = new Date(donation.createdAt).getFullYear();
      if (!acc[year]) {
        acc[year] = {
          year,
          total: 0,
          donated: 0,
          rejected: 0,
          pending: 0,
          donations: []
        };
      }
      acc[year].total++;
      acc[year].donations.push(donation);
      
      if (donation.status === DonationStatus.DONATED) acc[year].donated++;
      else if (donation.status === DonationStatus.REJECTED) acc[year].rejected++;
      else if (donation.status === DonationStatus.PENDING) acc[year].pending++;
      
      return acc;
    }, {});

    return {
      user: donations[0]?.user,
      summary: {
        totalDonations,
        successfulDonations,
        rejectedDonations,
        pendingDonations,
        successRate: totalDonations > 0 ? Math.round((successfulDonations / totalDonations) * 100) : 0
      },
      donationsByYear: Object.values(donationsByYear).sort((a: any, b: any) => b.year - a.year),
      allDonations: donations
    };
  }
}