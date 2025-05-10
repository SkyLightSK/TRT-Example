import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Username',
    example: 'john.doe',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 