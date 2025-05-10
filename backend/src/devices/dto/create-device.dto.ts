import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Device name',
    example: 'POS Terminal 1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Serial number',
    example: 'SN123456789',
  })
  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @ApiProperty({
    description: 'Model',
    example: 'Verifone MX915',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiPropertyOptional({
    description: 'Purchase date',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;

  @ApiPropertyOptional({
    description: 'Warranty expiration date',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  warrantyExpiration?: Date;

  @ApiProperty({
    description: 'Entity ID that owns this device',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  entityId: number;
} 