import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Entity as EntityModel } from '../../entities/entities/entity.entity';

@Entity()
export class BudgetItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EntityModel, entity => entity.budgetItems)
  entity: EntityModel;

  @Column()
  year: number;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  plannedAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  actualAmount: number;
} 