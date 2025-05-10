import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity as EntityModel } from '../../entities/entities/entity.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Username', example: 'john.doe' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'User password (hashed)', example: 'hashedpassword' })
  @Column()
  password: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ 
    description: 'User role', 
    enum: UserRole,
    example: UserRole.USER 
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({ description: 'Creation timestamp', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Entities the user can access', type: [EntityModel] })
  @ManyToMany(() => EntityModel)
  @JoinTable()
  entities: EntityModel[];
} 