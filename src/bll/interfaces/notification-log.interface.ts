import { NotificationStatus } from 'src/lib/enum';

export interface CreateNotificationLog {
  channel: string;
  provider: string;
  status: NotificationStatus;
  payload: any;
  attempts?: number;
  queued_at?: Date;
  parent_id?: number | null;
  provider_msg_id?: string | null;
  last_error?: string | null;
}
