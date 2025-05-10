import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Budget } from './entities/budget.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BudgetItem } from './entities/budget-item.entity';
import { BudgetsService } from './budgets.service';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({ status: 201, description: 'Budget has been successfully created', type: Budget })
  create(@Body() createBudgetDto: Partial<Budget>) {
    return this.budgetsService.create(createBudgetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all budgets' })
  @ApiQuery({ name: 'fiscalYear', required: false, description: 'Filter by fiscal year' })
  @ApiResponse({ status: 200, description: 'Return all budgets', type: [Budget] })
  findAll(@Query('fiscalYear') fiscalYear?: string) {
    return this.budgetsService.findAll(fiscalYear ? +fiscalYear : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a budget by id' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  @ApiResponse({ status: 200, description: 'Return the budget', type: Budget })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a budget' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  @ApiResponse({ status: 200, description: 'Budget has been successfully updated', type: Budget })
  update(@Param('id') id: string, @Body() updateBudgetDto: Partial<Budget>) {
    return this.budgetsService.update(+id, updateBudgetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a budget' })
  @ApiParam({ name: 'id', description: 'Budget ID' })
  @ApiResponse({ status: 200, description: 'Budget has been successfully deleted' })
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budget items' })
  @ApiResponse({ status: 200, description: 'Return all budget items', type: [BudgetItem] })
  findAllItems(): Promise<BudgetItem[]> {
    return this.budgetsService.findAllItems();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget item by id' })
  @ApiResponse({ status: 200, description: 'Return budget item by id', type: BudgetItem })
  @ApiResponse({ status: 404, description: 'Budget item not found' })
  findItem(@Param('id') id: string): Promise<BudgetItem> {
    return this.budgetsService.findOneItem(+id);
  }
} 