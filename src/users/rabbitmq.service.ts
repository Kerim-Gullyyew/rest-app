import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue: process.env.RABBITMQ_QUEUE_NAME,
        queueOptions: {
          durable: false
        },
      },
    });
  }

  async sendEvent(pattern: string, data: any) {
    return lastValueFrom(this.client.emit(pattern, data));
  }
}
