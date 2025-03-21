import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('env')
  getEnv() {
    return {
      databaseUrl: process.env.DATABASE_URL || 'No DATABASE_URL found',
    };
  }
  @Get('db')
  async testDatabase() {
    return this.appService.testDatabaseConnection();
  }
  @Get('hello')
  getHello() {
    return { message: 'Hello World!' };
  }
}
