import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByMobile(mobile: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { mobile },
      relations: ['donations']
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    createUserDto.password = await bcrypt.hash(createUserDto.mobile, 10);
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    updateUserDto.password = await bcrypt.hash(updateUserDto.mobile, 10);

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['donations'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['donations']
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async findByUsername(mobile: string): Promise<User | null>{
    return this.userRepository.findOne({ where: { mobile } });
  }
}