import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationLog } from './entities/notification.entity';
import { NotificationDataService } from 'src/dal/notification.data.service';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([NotificationLog])],
  providers: [NotificationDataService],
  exports: [NotificationDataService],
})
export class DalModule {}
