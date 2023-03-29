import { Controller, Get, Post } from "@nestjs/common";

@Controller('/')
export class getHome {
  @Get()
  getHome() {
    return 'Home Page'
  }

}