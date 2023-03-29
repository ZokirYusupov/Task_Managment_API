import { AuthGuard } from '@nestjs/passport';
import { GetTasksFilterDto } from './dto/get-tasks.filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status.enum';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() filterDto: GetTasksFilterDto) {
    // return this.tasksService.getAllTasks()
    return this.tasksService.getTasks(filterDto)
  }
  @Post('add')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
    ) {
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Get(':id')
    getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id)
  }
  // @Get(':id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.getTaskById(id)
  // }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id)
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
    )
     {
      const {status} = updateTaskStatusDto
      return this.tasksService.updateTaskStatus(id, status)
  }
}