import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
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
  findAll(@Query('year') year?: string) {
    return this.donationsService.findAll(year ? parseInt(year) : undefined);
  }

  @Get('statistics')
  getStatistics(@Query('year') year?: string) {
    return this.donationsService.getStatistics(year ? parseInt(year) : undefined);
  }

  @Get('years')
  getAvailableYears() {
    return this.donationsService.getAvailableYears();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.donationsService.findByUserId(+userId);
  }

  @Get('user/:userId/history')
  getUserDonationHistory(@Param('userId') userId: string) {
    return this.donationsService.getUserDonationHistory(+userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateDonationStatusDto) {
    return this.donationsService.updateStatus(+id, updateStatusDto);
  }
}