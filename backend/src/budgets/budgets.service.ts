import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { BudgetItem } from './entities/budget-item.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private budgetItemsRepository: Repository<BudgetItem>,
  ) {}

  async create(createBudgetDto: Partial<Budget>): Promise<Budget> {
    const budget = this.budgetsRepository.create(createBudgetDto);
    return this.budgetsRepository.save(budget);
  }

  async findAll(fiscalYear?: number): Promise<Budget[]> {
    const queryBuilder = this.budgetsRepository.createQueryBuilder('budget')
      .leftJoinAndSelect('budget.items', 'items');
    
    if (fiscalYear) {
      queryBuilder.where('budget.fiscalYear = :fiscalYear', { fiscalYear });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Budget> {
    const budget = await this.budgetsRepository.findOne({
      where: { id },
      relations: ['items', 'items.entity', 'entity'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    return budget;
  }

  async update(id: number, updateBudgetDto: Partial<Budget>): Promise<Budget> {
    const budget = await this.findOne(id);
    
    const updatedBudget = {
      ...budget,
      ...updateBudgetDto,
    };
    
    await this.budgetsRepository.save(updatedBudget);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const budget = await this.findOne(id);
    await this.budgetsRepository.remove(budget);
  }

  async findAllItems(): Promise<BudgetItem[]> {
    return this.budgetItemsRepository.find({ 
      relations: ['budget', 'entity'] 
    });
  }

  async findOneItem(id: number): Promise<BudgetItem> {
    const budgetItem = await this.budgetItemsRepository.findOne({ where: { id } });
    if (!budgetItem) {
      throw new NotFoundException(`Budget item with ID ${id} not found`);
    }
    return budgetItem;
  }
} 