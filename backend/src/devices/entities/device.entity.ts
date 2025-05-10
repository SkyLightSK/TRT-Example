import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity as EntityModel } from '../../entities/entities/entity.entity';

export enum DeviceType {
  Kiosk = 'Kiosk',
  Register = 'Register',
  DMB = 'DMB',
  Enclosure = 'Enclosure'
}

export enum DeviceStatus {
  Active = 'Active',
  Required = 'Required',
  Retired = 'Retired'
}

@Entity()
export class Device {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Device name', example: 'POS Terminal 1' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Serial number', example: 'SN123456789' })
  @Column()
  serialNumber: string;

  @ApiProperty({ description: 'Model', example: 'Verifone MX915' })
  @Column()
  model: string;

  @ApiProperty({ description: 'Device type', enum: DeviceType, example: DeviceType.Kiosk })
  @Column({ type: 'enum', enum: DeviceType, default: DeviceType.Kiosk })
  deviceType: DeviceType;

  @ApiProperty({ description: 'Device status', enum: DeviceStatus, example: DeviceStatus.Active })
  @Column({ type: 'enum', enum: DeviceStatus, default: DeviceStatus.Active })
  deviceStatus: DeviceStatus;

  @ApiPropertyOptional({ description: 'Purchase date', example: '2023-01-01' })
  @Column({ nullable: true })
  purchaseDate: Date;

  @ApiPropertyOptional({ description: 'Warranty expiration date', example: '2025-01-01' })
  @Column({ nullable: true })
  warrantyExpiration: Date;

  @ApiProperty({ description: 'Entity that owns this device' })
  @ManyToOne(() => EntityModel, entity => entity.devices, { lazy: true })
  entity: Promise<EntityModel>;

  @ApiProperty({ description: 'Creation timestamp', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;
} 