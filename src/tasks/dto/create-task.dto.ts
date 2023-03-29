import { IsNotEmpty, Length } from "class-validator";

export class CreateTaskDto {
  @Length(5, 20)
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}