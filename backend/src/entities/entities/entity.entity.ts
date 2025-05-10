import { Entity as EntityDecorator, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Device } from '../../devices/entities/device.entity';
import { BudgetItem } from '../../budgets/entities/budget-item.entity';
import { Budget } from '../../budgets/entities/budget.entity';

@EntityDecorator()
export class Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Entity, entity => entity.children, { lazy: true })
  parent: Promise<Entity>;

  @OneToMany(() => Entity, entity => entity.parent, { lazy: true })
  children: Promise<Entity[]>;

  @OneToMany(() => Device, device => device.entity, { lazy: true })
  devices: Promise<Device[]>;

  @OneToMany(() => BudgetItem, budgetItem => budgetItem.entity, { lazy: true })
  budgetItems: Promise<BudgetItem[]>;

  @OneToMany(() => Budget, budget => budget.entity, { lazy: true })
  budgets: Promise<Budget[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 