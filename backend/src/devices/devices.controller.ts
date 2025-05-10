import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Device } from './entities/device.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DevicesService } from './devices.service';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new device' })
  @ApiResponse({ status: 201, description: 'Device has been successfully created', type: Device })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all devices' })
  @ApiQuery({ name: 'entityId', required: false, description: 'Filter by entity ID' })
  @ApiResponse({ status: 200, description: 'Return all devices', type: [Device] })
  findAll(@Query('entityId') entityId?: string): Promise<Device[]> {
    return this.devicesService.findAll(entityId ? +entityId : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get device by id' })
  @ApiParam({ name: 'id', description: 'Device ID' })
  @ApiResponse({ status: 200, description: 'Return device by id', type: Device })
  @ApiResponse({ status: 404, description: 'Device not found' })
  findOne(@Param('id') id: string): Promise<Device> {
    return this.devicesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a device' })
  @ApiParam({ name: 'id', description: 'Device ID' })
  @ApiResponse({ status: 200, description: 'Device has been successfully updated', type: Device })
  @ApiResponse({ status: 404, description: 'Device not found' })
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(+id, updateDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a device' })
  @ApiParam({ name: 'id', description: 'Device ID' })
  @ApiResponse({ status: 200, description: 'Device has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  remove(@Param('id') id: string) {
    return this.devicesService.remove(+id);
  }
} 