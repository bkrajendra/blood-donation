import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationStatusDto } from './dto/update-donation-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  @Get()
  findAll(@Query('year') year?: string) {
    return this.donationsService.findAll(year ? parseInt(year) : undefined);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  @Get('statistics')
  getStatistics(@Query('year') year?: string) {
    return this.donationsService.getStatistics(year ? parseInt(year) : undefined);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  @Get('years')
  getAvailableYears() {
    return this.donationsService.getAvailableYears();
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  // @Roles('bd_staff')
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.donationsService.findByUserId(+userId);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  @Get('user/:userId/history')
  getUserDonationHistory(@Param('userId') userId: string) {
    return this.donationsService.getUserDonationHistory(+userId);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  // @Roles('bd_staff')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateDonationStatusDto) {
    return this.donationsService.updateStatus(+id, updateStatusDto);
  }
}