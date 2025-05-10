import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Budget } from './budget.entity';
import { Entity as EntityModel } from '../../entities/entities/entity.entity';

@Entity()
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Budget, budget => budget.items, { lazy: true })
  budget: Promise<Budget>;

  @ManyToOne(() => EntityModel, entity => entity.budgetItems, { lazy: true })
  entity: Promise<EntityModel>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 