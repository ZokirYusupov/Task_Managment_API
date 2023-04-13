import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transformer.interceptor';

// console.log(process.env.NODE);
async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  const port: number = +process.env.PORT
  await app.listen(port);
  logger.log(`Application listening on port http://localhost:${port}`)
  // console.log(`Server run on port http://localhost:${3000}`);
}
bootstrap();

