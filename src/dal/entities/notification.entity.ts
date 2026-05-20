import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

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
  @ForeignKey(() => NotificationLog)
  parent_id?: number | null;

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

  @Column
  provider_msg_id?: string;

  @Column
  attempts: number;

  @Column
  last_error?: string;

  @Column
  queued_at?: Date;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;

  @HasMany(() => NotificationLog, { foreignKey: 'parent_id', as: 'child_logs' })
  child_logs: NotificationLog[];
}
