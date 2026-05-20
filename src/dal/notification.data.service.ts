import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NotificationLog } from './entities/notification.entity';
import { CreateNotificationLog } from 'src/bll/interfaces/notification-log.interface';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class NotificationDataService {
  constructor(@InjectModel(NotificationLog) private model: typeof NotificationLog) {}

  createLog(data: CreateNotificationLog) {
    return this.model.create({
      channel: data.channel,
      provider: data.provider,
      status: data.status,
      payload: data.payload,
      attempts: data.attempts ?? 0,
      queued_at: data.queued_at,
      parent_id: data.parent_id ?? null,
      provider_msg_id: data.provider_msg_id ?? null,
      last_error: data.last_error ?? null,
    });
  }

  async getLog(id: number) {
    return this.model.findOne({
      where: {
        id,
      },
      include: [
        {
          model: NotificationLog,
          as: 'child_logs',
          required: false,
        },
      ],
    });
  }

  async getLogs(query: PaginationDto) {
    const { limit = 10, offset = 0 } = query;

    return this.model.findAll({
      where: {
        parent_id: null,
      },
      include: [
        {
          model: NotificationLog,
          as: 'child_logs',
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      limit: +limit,
      offset: +offset,
    });
  }
}
