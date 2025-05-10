import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entity } from '../entities/entities/entity.entity';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class EntitiesSeeder extends BaseSeeder<Entity> {
  constructor(
    @InjectRepository(Entity)
    private readonly entitiesRepository: Repository<Entity>,
  ) {
    super(entitiesRepository, 'Entity');
  }

  async seed(): Promise<void> {
    this.logger.log('Seeding entities...');
    
    // Separate parent entities from child entities
    const parentEntities = [
      {
        name: 'Aaron, James D Jr',
        description: 'Owner/Operator for North Region',
        code: 'NO-001',
        parentId: null
      },
      {
        name: 'Smith, Sarah K',
        description: 'Owner/Operator for East Region',
        code: 'EA-001',
        parentId: null
      },
      {
        name: 'Johnson, Michael T',
        description: 'Owner/Operator for West Region',
        code: 'WE-001',
        parentId: null
      }
    ];
    
    // Step 1: Create parent entities first
    const parentEntityMap = new Map<string, number>();
    
    for (const entityData of parentEntities) {
      const existingEntity = await this.entitiesRepository.findOne({ 
        where: { code: entityData.code } 
      });
      
      if (!existingEntity) {
        const savedEntity = await this.entitiesRepository.save(entityData);
        this.logger.log(`Created parent entity: ${savedEntity.name} with ID ${savedEntity.id}`);
        parentEntityMap.set(entityData.code, savedEntity.id);
      } else {
        this.logger.log(`Parent entity ${entityData.name} already exists with ID ${existingEntity.id}`);
        parentEntityMap.set(entityData.code, existingEntity.id);
      }
    }
    
    // Step 2: Create child entities with correct parent IDs
    const childEntities = [
      {
        name: 'Store #1234 - North Oak',
        description: 'North Oak Street Location',
        code: 'NO-1234',
        parentCode: 'NO-001'
      },
      {
        name: 'Store #2345 - East Main',
        description: 'East Main Street Location',
        code: 'EA-2345',
        parentCode: 'EA-001'
      },
      {
        name: 'Store #3456 - West Lake',
        description: 'West Lake Avenue Location',
        code: 'WE-3456',
        parentCode: 'WE-001'
      }
    ];
    
    for (const childData of childEntities) {
      const { parentCode, ...entityData } = childData;
      const parentId = parentEntityMap.get(parentCode);
      
      if (!parentId) {
        this.logger.warn(`Parent entity with code ${parentCode} not found, skipping child entity ${childData.name}`);
        continue;
      }
      
      const existingEntity = await this.entitiesRepository.findOne({ 
        where: { code: entityData.code } 
      });
      
      if (!existingEntity) {
        await this.entitiesRepository.save({
          ...entityData,
          parentId
        });
        this.logger.log(`Created child entity: ${entityData.name} with parent ID ${parentId}`);
      } else {
        this.logger.log(`Child entity ${entityData.name} already exists, skipping`);
      }
    }
    
    this.logger.log('Entities seeding completed');
  }
  
  async delete(): Promise<void> {
    this.logger.log('Deleting entities...');
    await this.entitiesRepository.clear();
    this.logger.log('Entities deleted');
  }
} 