import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Entity as EntityModel } from '../../entities/entities/entity.entity';

export enum DeviceType {
  Kiosk = 'Kiosk',
  Register = 'Register',
  DMB = 'DMB',
  Enclosure = 'Enclosure'
}

export enum DeviceStatus {
  Active = 'Active',
  Required = 'Required',
  Retired = 'Retired'
}

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nsn: string;

  @Column({
    type: 'enum',
    enum: DeviceType
  })
  type: DeviceType;

  @Column()
  manufacturer: string;

  @Column()
  model: string;

  @Column()
  location: string;

  @Column()
  endOfLife: Date;

  @Column({
    type: 'enum',
    enum: DeviceStatus
  })
  status: DeviceStatus;

  @Column({ nullable: true })
  eligibleUpgrade: string;

  @ManyToOne(() => EntityModel, entity => entity.devices)
  entity: EntityModel;
} 