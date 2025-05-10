import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    // Create a new device instance
    const newDevice = new Device();
    
    // Copy all properties from DTO
    Object.assign(newDevice, createDeviceDto);
    
    // Set entity relation with Promise for lazy loading
    if (createDeviceDto.entityId) {
      newDevice.entity = Promise.resolve({ id: createDeviceDto.entityId } as any);
    }
    
    // Save and return the device
    return this.devicesRepository.save(newDevice);
  }

  async findAll(entityId?: number): Promise<Device[]> {
    const queryBuilder = this.devicesRepository.createQueryBuilder('device')
      .leftJoinAndSelect('device.entity', 'entity');
    
    if (entityId) {
      queryBuilder.where('entity.id = :entityId', { entityId });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Device> {
    const device = await this.devicesRepository.findOne({ 
      where: { id },
      relations: ['entity']
    });
    
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    
    return device;
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);
    
    const updatedDevice = {
      ...device,
      ...updateDeviceDto,
    };
    
    if (updateDeviceDto.entityId) {
      updatedDevice.entity = Promise.resolve({ id: updateDeviceDto.entityId } as any);
    }
    
    await this.devicesRepository.save(updatedDevice);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const device = await this.findOne(id);
    await this.devicesRepository.remove(device);
  }
} 