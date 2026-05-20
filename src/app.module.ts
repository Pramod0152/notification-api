import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from './app/services/sequelize-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from './app/common/logger/logger.module';
import { ExceptionsFilterService } from './app/services/exception-filter.service';
import { BullModule } from '@nestjs/bullmq';
import { ResponseModule } from './app/common/response/response.module';
import { DalModule } from './dal/dal.module';
import { ServiceModule } from './bll/service.module';
import { FrontendModule } from './modules/frontend.module';
import { BullQueueModule } from './modules/bull-queue-module';
import { WorkerModule } from './bll/workers/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullQueueModule,
    ResponseModule,
    DalModule,
    ServiceModule,
    WorkerModule,
    FrontendModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    LoggerModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilterService,
    },
  ],
})
export class AppModule {}
