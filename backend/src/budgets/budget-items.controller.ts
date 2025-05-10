import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BudgetItem } from './entities/budget-item.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BudgetItemsService } from './budget-items.service';

@ApiTags('budget-items')
@Controller('budget-items')
export class BudgetItemsController {
  constructor(private readonly budgetItemsService: BudgetItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new budget item' })
  @ApiResponse({ status: 201, description: 'Budget item has been successfully created', type: BudgetItem })
  create(@Body() createBudgetItemDto: Partial<BudgetItem>) {
    return this.budgetItemsService.create(createBudgetItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all budget items' })
  @ApiQuery({ name: 'budgetId', required: false, description: 'Filter by budget ID' })
  @ApiQuery({ name: 'entityId', required: false, description: 'Filter by entity ID' })
  @ApiResponse({ status: 200, description: 'Return all budget items', type: [BudgetItem] })
  findAll(
    @Query('budgetId') budgetId?: string,
    @Query('entityId') entityId?: string,
  ) {
    return this.budgetItemsService.findAll(
      budgetId ? +budgetId : undefined,
      entityId ? +entityId : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a budget item by id' })
  @ApiParam({ name: 'id', description: 'Budget Item ID' })
  @ApiResponse({ status: 200, description: 'Return the budget item', type: BudgetItem })
  @ApiResponse({ status: 404, description: 'Budget item not found' })
  findOne(@Param('id') id: string) {
    return this.budgetItemsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a budget item' })
  @ApiParam({ name: 'id', description: 'Budget Item ID' })
  @ApiResponse({ status: 200, description: 'Budget item has been successfully updated', type: BudgetItem })
  update(@Param('id') id: string, @Body() updateBudgetItemDto: Partial<BudgetItem>) {
    return this.budgetItemsService.update(+id, updateBudgetItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a budget item' })
  @ApiParam({ name: 'id', description: 'Budget Item ID' })
  @ApiResponse({ status: 200, description: 'Budget item has been successfully deleted' })
  remove(@Param('id') id: string) {
    return this.budgetItemsService.remove(+id);
  }
} 