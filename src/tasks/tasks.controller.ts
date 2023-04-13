import { AuthGuard } from '@nestjs/passport';
import { GetTasksFilterDto } from './dto/get-tasks.filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status.enum';
import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController')
  constructor(
    private readonly tasksService: TasksService,
    // private configService: ConfigService
    ) {}

  @Get()
  getAllTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
    ) {
    // return this.tasksService.getAllTasks()
    this.logger.verbose(`User ${user.username} retrieving all tasks Filters ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto,user)
  }
  @Post('add')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
    ) {
      this.logger.verbose(`User ${user.username} creating a new task ${JSON.stringify(createTaskDto)}`)
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Get(':id')
    getTaskById(
      @Param('id') id: string,
      user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user)
  }
  // @Get(':id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.getTaskById(id)
  // }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.deleteTask(id, user)
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    user: User
    )
     {
      const {status} = updateTaskStatusDto
      return this.tasksService.updateTaskStatus(id, status, user)
  }
}
