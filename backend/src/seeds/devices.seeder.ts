import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Device, DeviceStatus, DeviceType } from '../devices/entities/device.entity';
import { Entity } from '../entities/entities/entity.entity';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class DevicesSeeder extends BaseSeeder<Device> {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,
    @InjectRepository(Entity)
    private readonly entitiesRepository: Repository<Entity>,
  ) {
    super(devicesRepository, 'Device');
  }

  async seed(): Promise<void> {
    this.logger.log('Seeding devices...');
    
    // Get all the store entities (those with parentId not null)
    const storeEntities = await this.entitiesRepository.find({
      where: { parentId: Not(null) }
    });
    
    if (storeEntities.length === 0) {
      this.logger.warn('No store entities found, skipping device seeding');
      return;
    }
    
    // Create 2-3 devices for each store entity
    for (const storeEntity of storeEntities) {
      // Kiosk
      await this.createDeviceIfNotExists({
        name: `Kiosk 1 - ${storeEntity.code}`,
        serialNumber: `KSK-${storeEntity.code}-001`,
        model: 'Verifone MX915',
        deviceType: DeviceType.Kiosk,
        deviceStatus: DeviceStatus.Active,
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiration: new Date('2026-01-15'),
        entity: Promise.resolve(storeEntity)
      });
      
      // Register
      await this.createDeviceIfNotExists({
        name: `Register 1 - ${storeEntity.code}`,
        serialNumber: `REG-${storeEntity.code}-001`,
        model: 'NCR RealPOS 7801',
        deviceType: DeviceType.Register,
        deviceStatus: DeviceStatus.Active,
        purchaseDate: new Date('2023-02-20'),
        warrantyExpiration: new Date('2026-02-20'),
        entity: Promise.resolve(storeEntity)
      });
      
      // DMB (Digital Menu Board)
      await this.createDeviceIfNotExists({
        name: `DMB 1 - ${storeEntity.code}`,
        serialNumber: `DMB-${storeEntity.code}-001`,
        model: 'Samsung QM43R-F',
        deviceType: DeviceType.DMB,
        deviceStatus: DeviceStatus.Active,
        purchaseDate: new Date('2023-03-10'),
        warrantyExpiration: new Date('2026-03-10'),
        entity: Promise.resolve(storeEntity)
      });
    }
    
    this.logger.log('Devices seeding completed');
  }
  
  private async createDeviceIfNotExists(deviceData: Partial<Device>): Promise<void> {
    const existingDevice = await this.devicesRepository.findOne({ 
      where: { serialNumber: deviceData.serialNumber } 
    });
    
    if (!existingDevice) {
      await this.devicesRepository.save(deviceData);
      this.logger.log(`Created device: ${deviceData.name}`);
    } else {
      this.logger.log(`Device ${deviceData.name} already exists, skipping`);
    }
  }

  async delete(): Promise<void> {
    this.logger.log('Deleting devices...');
    await this.devicesRepository.clear();
    this.logger.log('Devices deleted');
  }
} 