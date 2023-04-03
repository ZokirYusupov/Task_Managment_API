// import { User } from './../auth/user.entity';
import { User } from 'src/auth/user.entity';
import {TaskStatus } from './task.status.enum';
import { Injectable, NotFoundException } from "@nestjs/common";
// import { randomUUID } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}
  // private tasks: Task[] = []
  async getAllTasks()  {
    return this.tasksRepository.find()
  }

 async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {title, description} = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    })

    await this.tasksRepository.save(task)

    return task
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User) {
    const { status, search } = filterDto
    const query = this.tasksRepository.createQueryBuilder('task')
    query.where({user})
    if (status) {
      query.andWhere('task.status = :status', {status})
    }
    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        {search: `%${search}%`},
      )
    }

    const tasks = await query.getMany()

    return tasks
  }


  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id,
        user
      }
    }) 
    if(!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
    return found
  }



  async deleteTask(id: string, user: User) {
    const result = await this.tasksRepository.delete({id, user})
    // console.log(result);
    if(result.affected === 0){
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
    // this.tasks = this.tasks.filter((task) => task.id !== found.id)
    return 'Successfuly deleted'
  }

 async updateTaskStatus(id: string, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user)
    
    task.status = status
    await this.tasksRepository.save(task)

    return task
  }


}