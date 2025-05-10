import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { BaseSeeder } from './base.seeder';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder extends BaseSeeder<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository, 'User');
  }

  async seed(): Promise<void> {
    this.logger.log('Seeding users...');
    
    // Define users
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        password: 'Admin123!' // This will be hashed below
      },
      {
        username: 'john.operator',
        email: 'operator1@example.com',
        firstName: 'John',
        lastName: 'Operator',
        role: UserRole.USER,
        password: 'Operator123!' // This will be hashed below
      },
      {
        username: 'jane.operator',
        email: 'operator2@example.com',
        firstName: 'Jane',
        lastName: 'Operator',
        role: UserRole.USER,
        password: 'Operator123!' // This will be hashed below
      }
    ];
    
    // Create users if they don't exist
    for (const userData of users) {
      await this.createUserIfNotExists(userData);
    }
    
    this.logger.log('Users seeding completed');
  }
  
  private async createUserIfNotExists(userData: Partial<User> & { password: string }): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: userData.email } 
    });
    
    if (!existingUser) {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Create and save the user
      await this.usersRepository.save({
        ...userData,
        password: hashedPassword
      });
      
      this.logger.log(`Created user: ${userData.email}`);
    } else {
      this.logger.log(`User ${userData.email} already exists, skipping`);
    }
  }
  
  async delete(): Promise<void> {
    this.logger.log('Deleting users...');
    await this.usersRepository.clear();
    this.logger.log('Users deleted');
  }
} 