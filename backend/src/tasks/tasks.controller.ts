import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { User } from '../generated/prisma/client.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { AccountGuard } from '../auth/guards/account.guard.js';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { UserSyncGuard } from '../auth/guards/user-sync.guard.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@UseGuards(ClerkAuthGuard, UserSyncGuard, AccountGuard)
@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query() query: ListTasksQueryDto) {
    return this.tasksService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tasksService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tasksService.remove(user.id, id);
  }
}
