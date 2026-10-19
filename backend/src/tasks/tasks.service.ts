import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        userId,
      },
    });
  }

  async findAll(userId: string, query: ListTasksQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.search
        ? {
            title: {
              contains: query.search.trim(),
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    return task;
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    // Checking ownership first prevents updates to another user's task.
    await this.findOne(userId, taskId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() || null }
          : {}),
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.dueDate !== undefined
          ? { dueDate: new Date(dto.dueDate) }
          : {}),
      },
    });
  }

  async remove(userId: string, taskId: string) {
    // The same ownership rule applies to deletion.
    await this.findOne(userId, taskId);

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully.' };
  }
}
