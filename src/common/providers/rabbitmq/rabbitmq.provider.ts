import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { AmqpConfig } from '../config/amqp.config';
import { ConfigModule } from '../config/config.module';

export const DynamicRabbitMQModule = RabbitMQModule.forRootAsync(RabbitMQModule, {
  imports: [ConfigModule],
  inject: [AmqpConfig],
  useFactory: ({ amqpUrl: uri }: AmqpConfig) => ({ uri })
});
