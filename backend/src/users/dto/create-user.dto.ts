import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'john.doe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 