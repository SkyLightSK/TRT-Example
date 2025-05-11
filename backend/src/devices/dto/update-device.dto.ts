import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceType, DeviceStatus } from '../entities/device.entity';

export class UpdateDeviceDto {
  @ApiPropertyOptional({
    description: 'Device name',
    example: 'POS Terminal 1',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Serial number',
    example: 'SN123456789',
  })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({
    description: 'Model',
    example: 'Verifone MX915',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Device type',
    enum: DeviceType,
    example: DeviceType.Kiosk,
  })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiPropertyOptional({
    description: 'Device status',
    enum: DeviceStatus,
    example: DeviceStatus.Active,
  })
  @IsOptional()
  @IsEnum(DeviceStatus)
  deviceStatus?: DeviceStatus;

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

  @ApiPropertyOptional({
    description: 'Entity ID that owns this device',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  entityId?: number;
} 