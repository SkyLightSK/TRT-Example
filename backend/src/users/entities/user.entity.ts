import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Entity as EntityModel } from '../../entities/entities/entity.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column('simple-array')
  roles: string[];

  @ManyToMany(() => EntityModel)
  @JoinTable()
  impersonableEntities: EntityModel[];
} 