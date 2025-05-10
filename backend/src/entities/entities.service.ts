import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entity } from './entities/entity.entity';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(Entity)
    private entitiesRepository: Repository<Entity>,
  ) {}

  async findAll(): Promise<Entity[]> {
    return this.entitiesRepository.find({
      relations: ['parent', 'children', 'devices', 'budgetItems'],
    });
  }

  async findOne(id: number): Promise<Entity> {
    const entity = await this.entitiesRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'devices', 'budgetItems'],
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }

  async create(createEntityDto: Partial<Entity>): Promise<Entity> {
    const entity = this.entitiesRepository.create(createEntityDto);
    return this.entitiesRepository.save(entity);
  }

  async update(id: number, updateEntityDto: Partial<Entity>): Promise<Entity> {
    const entity = await this.findOne(id);
    
    const updatedEntity = {
      ...entity,
      ...updateEntityDto,
    };
    
    await this.entitiesRepository.save(updatedEntity);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.entitiesRepository.remove(entity);
  }
} 