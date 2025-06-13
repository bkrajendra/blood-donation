import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationStatusDto } from './dto/update-donation-status.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  findAll() {
    return this.donationsService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.donationsService.getStatistics();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.donationsService.findByUserId(+userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateDonationStatusDto) {
    return this.donationsService.updateStatus(+id, updateStatusDto);
  }
}