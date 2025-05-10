import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Entity } from './entities/entity.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EntitiesService } from './entities.service';

@ApiTags('entities')
@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({ status: 200, description: 'Return all entities', type: [Entity] })
  findAll(): Promise<Entity[]> {
    return this.entitiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get entity by id' })
  @ApiParam({ name: 'id', description: 'Entity ID' })
  @ApiResponse({ status: 200, description: 'Return entity by id', type: Entity })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  findOne(@Param('id') id: string): Promise<Entity> {
    return this.entitiesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 201, description: 'Entity has been successfully created', type: Entity })
  create(@Body() createEntityDto: Partial<Entity>) {
    return this.entitiesService.create(createEntityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', description: 'Entity ID' })
  @ApiResponse({ status: 200, description: 'Entity has been successfully updated', type: Entity })
  update(@Param('id') id: string, @Body() updateEntityDto: Partial<Entity>) {
    return this.entitiesService.update(+id, updateEntityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an entity' })
  @ApiParam({ name: 'id', description: 'Entity ID' })
  @ApiResponse({ status: 200, description: 'Entity has been successfully deleted' })
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(+id);
  }
} 