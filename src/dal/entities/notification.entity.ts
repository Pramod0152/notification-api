import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'notification_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class NotificationLog extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column
  channel: string;

  @Column
  provider: string;

  @Column
  status: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  payload: any;

  @Column({ field: 'provider_msg_id' })
  providerMsgId?: string;

  @Column
  attempts: number;

  @Column({ field: 'last_error' })
  lastError?: string;

  @Column({ field: 'queued_at' })
  queuedAt?: Date;
}
