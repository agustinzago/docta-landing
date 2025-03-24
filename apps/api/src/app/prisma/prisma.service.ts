import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Configuración del pool de conexiones
      // log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Método helper para limpiar conexiones en pruebas
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'test') {
      // Eliminar datos de prueba
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    await app.close();
  }
}
