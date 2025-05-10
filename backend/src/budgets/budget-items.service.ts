import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetItem } from './entities/budget-item.entity';

@Injectable()
export class BudgetItemsService {
  constructor(
    @InjectRepository(BudgetItem)
    private budgetItemsRepository: Repository<BudgetItem>,
  ) {}

  async create(createBudgetItemDto: Partial<BudgetItem>): Promise<BudgetItem> {
    const budgetItem = this.budgetItemsRepository.create(createBudgetItemDto);
    
    if (createBudgetItemDto.budget && typeof createBudgetItemDto.budget === 'object') {
      const budgetId = createBudgetItemDto.budget['id'];
      if (budgetId) {
        budgetItem.budget = Promise.resolve({ id: budgetId } as any);
      }
    }
    
    if (createBudgetItemDto.entity && typeof createBudgetItemDto.entity === 'object') {
      const entityId = createBudgetItemDto.entity['id'];
      if (entityId) {
        budgetItem.entity = Promise.resolve({ id: entityId } as any);
      }
    }
    
    return this.budgetItemsRepository.save(budgetItem);
  }

  async findAll(budgetId?: number, entityId?: number): Promise<BudgetItem[]> {
    const queryBuilder = this.budgetItemsRepository.createQueryBuilder('budgetItem')
      .leftJoinAndSelect('budgetItem.budget', 'budget')
      .leftJoinAndSelect('budgetItem.entity', 'entity');
    
    if (budgetId) {
      queryBuilder.andWhere('budget.id = :budgetId', { budgetId });
    }
    
    if (entityId) {
      queryBuilder.andWhere('entity.id = :entityId', { entityId });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<BudgetItem> {
    const budgetItem = await this.budgetItemsRepository.findOne({
      where: { id },
      relations: ['budget', 'entity'],
    });

    if (!budgetItem) {
      throw new NotFoundException(`Budget item with ID ${id} not found`);
    }

    return budgetItem;
  }

  async update(id: number, updateBudgetItemDto: Partial<BudgetItem>): Promise<BudgetItem> {
    const budgetItem = await this.findOne(id);
    
    const updatedBudgetItem = {
      ...budgetItem,
      ...updateBudgetItemDto,
    };
    
    if (updateBudgetItemDto.budget && typeof updateBudgetItemDto.budget === 'object') {
      const budgetId = updateBudgetItemDto.budget['id'];
      if (budgetId) {
        updatedBudgetItem.budget = Promise.resolve({ id: budgetId } as any);
      }
    }
    
    if (updateBudgetItemDto.entity && typeof updateBudgetItemDto.entity === 'object') {
      const entityId = updateBudgetItemDto.entity['id'];
      if (entityId) {
        updatedBudgetItem.entity = Promise.resolve({ id: entityId } as any);
      }
    }
    
    await this.budgetItemsRepository.save(updatedBudgetItem);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const budgetItem = await this.findOne(id);
    await this.budgetItemsRepository.remove(budgetItem);
  }
} 