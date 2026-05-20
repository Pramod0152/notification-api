import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { BullQueueName } from 'src/lib/enum';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: BullQueueName.EMAIL,
    }),
    BullModule.registerQueue({
      name: BullQueueName.SMS,
    }),
    BullModule.registerQueue({
      name: BullQueueName.WHATSAPP,
    }),
  ],
  exports: [BullModule],
})
export class BullQueueModule {}
