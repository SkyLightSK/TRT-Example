import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { BudgetItem } from './budget-item.entity';
import { Entity as EntityModel } from '../../entities/entities/entity.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  fiscalYear: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => EntityModel, entity => entity.budgets, { lazy: true })
  entity: Promise<EntityModel>;

  @OneToMany(() => BudgetItem, budgetItem => budgetItem.budget)
  items: BudgetItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 