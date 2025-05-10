import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john.doe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
} 