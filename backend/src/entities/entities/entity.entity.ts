import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Device } from '../../devices/entities/device.entity';
import { BudgetItem } from '../../budgets/entities/budget-item.entity';

@Entity()
export class Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  parentEntityId: string;

  @ManyToOne(() => Entity, { nullable: true })
  parentEntity: Entity;

  @OneToMany(() => Device, device => device.entity)
  devices: Device[];

  @OneToMany(() => BudgetItem, budgetItem => budgetItem.entity)
  budgetItems: BudgetItem[];
} 