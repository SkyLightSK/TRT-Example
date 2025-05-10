import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
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
    this.logger.log('STARTING DEVICE SEEDER');
    
    // Find all store entities (they have parentId not null)
    const storeEntities = await this.entitiesRepository.find({
      where: { parentId: Not(IsNull()) }
    });
    
    this.logger.log(`Found ${storeEntities.length} store entities for seeding`);
    
    if (storeEntities.length === 0) {
      this.logger.warn('No store entities found, skipping device seeding');
      return;
    }
    
    let createdCount = 0;
    
    // Create devices for each store
    for (const storeEntity of storeEntities) {
      this.logger.log(`Creating devices for store: ${storeEntity.name} (ID: ${storeEntity.id})`);
      
      try {
        // Create a Kiosk device
        const kiosk = this.devicesRepository.create({
          name: `Kiosk 1 - ${storeEntity.code}`,
          serialNumber: `KSK-${storeEntity.code}-001`,
          model: 'Verifone MX915',
          deviceType: DeviceType.Kiosk,
          deviceStatus: DeviceStatus.Active,
          purchaseDate: new Date('2023-01-15'),
          warrantyExpiration: new Date('2026-01-15')
        });
        
        // Set the relationship
        kiosk.entity = Promise.resolve(storeEntity);
        
        // Save to database
        await this.devicesRepository.save(kiosk);
        createdCount++;
        this.logger.log(`Created Kiosk device for ${storeEntity.name}`);
        
        // Create a Register device
        const register = this.devicesRepository.create({
          name: `Register 1 - ${storeEntity.code}`,
          serialNumber: `REG-${storeEntity.code}-001`,
          model: 'NCR RealPOS 7801',
          deviceType: DeviceType.Register,
          deviceStatus: DeviceStatus.Active,
          purchaseDate: new Date('2023-02-20'),
          warrantyExpiration: new Date('2026-02-20')
        });
        
        // Set the relationship
        register.entity = Promise.resolve(storeEntity);
        
        // Save to database
        await this.devicesRepository.save(register);
        createdCount++;
        this.logger.log(`Created Register device for ${storeEntity.name}`);
        
        // Create a DMB device
        const dmb = this.devicesRepository.create({
          name: `DMB 1 - ${storeEntity.code}`,
          serialNumber: `DMB-${storeEntity.code}-001`,
          model: 'Samsung QM43R-F',
          deviceType: DeviceType.DMB,
          deviceStatus: DeviceStatus.Active,
          purchaseDate: new Date('2023-03-10'),
          warrantyExpiration: new Date('2026-03-10')
        });
        
        // Set the relationship
        dmb.entity = Promise.resolve(storeEntity);
        
        // Save to database
        await this.devicesRepository.save(dmb);
        createdCount++;
        this.logger.log(`Created DMB device for ${storeEntity.name}`);
        
      } catch (error) {
        this.logger.error(`Error creating devices for store ${storeEntity.name}: ${error.message}`);
      }
    }
    
    this.logger.log(`DEVICE SEEDING COMPLETED: Created ${createdCount} devices for ${storeEntities.length} stores`);
  }

  async delete(): Promise<void> {
    this.logger.log('Deleting all devices...');
    await this.devicesRepository.clear();
    this.logger.log('All devices deleted');
  }
} 