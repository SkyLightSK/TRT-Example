import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User has been successfully created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return the user', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User has been successfully updated', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
} 