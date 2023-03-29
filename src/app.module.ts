import { getHome } from './home/home.controller';
import { TasksModule } from './tasks/tasks.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'task_managment',
      autoLoadEntities: true,
      // entities: [Task],
      synchronize: true
    }),
    TasksModule,
    AuthModule],
  controllers: [getHome]
})
export class AppModule {}
