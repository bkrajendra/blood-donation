import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  // @Roles('bd_staff')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  // @Roles('bd_staff')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get('search')
  findByMobile(@Query('mobile') mobile: string) {
    return this.usersService.findByMobile(mobile);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  // @Roles('bd_staff')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('bd_admin')
  // @Roles('bd_staff')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}