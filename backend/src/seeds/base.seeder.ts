import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

export abstract class BaseSeeder<T> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityName: string
  ) {}

  abstract seed(): Promise<void>;

  async delete(): Promise<void> {
    this.logger.log(`Deleting all ${this.entityName} records...`);
    await this.repository.clear();
    this.logger.log(`All ${this.entityName} records deleted`);
  }
} 