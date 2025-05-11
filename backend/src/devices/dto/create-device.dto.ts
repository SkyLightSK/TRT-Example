import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceType, DeviceStatus } from '../entities/device.entity';

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

  @ApiProperty({
    description: 'Device type',
    enum: DeviceType,
    example: DeviceType.Kiosk,
  })
  @IsEnum(DeviceType)
  deviceType: DeviceType;

  @ApiProperty({
    description: 'Device status',
    enum: DeviceStatus,
    example: DeviceStatus.Active,
  })
  @IsEnum(DeviceStatus)
  deviceStatus: DeviceStatus;

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