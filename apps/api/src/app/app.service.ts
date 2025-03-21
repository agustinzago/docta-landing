import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private prisma = new PrismaClient();

  async testDatabaseConnection() {
    try {
      await this.prisma.$connect();
      return { message: 'Database connected successfully!' };
    } catch {
      return { error: 'Failed to connect to database' };
    }
  }
}
