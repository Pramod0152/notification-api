import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from './app/services/sequelize-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from './app/common/logger/logger.module';
import { ExceptionsFilterService } from './app/services/exception-filter.service';
import { BullModule } from '@nestjs/bull';
import { ResponseModule } from './app/common/response/response.module';
import { DalModule } from './dal/dal.module';
import { ServiceModule } from './bll/service.module';
import { FrontendModule } from './modules/frontend.module';

@Module({
  imports: [
    ResponseModule,
    DalModule,
    ServiceModule,
    FrontendModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    BullModule.registerQueue({
      name: 'notification',
      url: 'redis://default:aNvCzgFbVbhcQNpXwRoMuHrLWOkwoeOO@redis-11011.c91.us-east-1-3.ec2.cloud.redislabs.com:11011',
    }),
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
