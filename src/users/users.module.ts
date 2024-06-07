import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { AvatarSchema } from './schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from './email.service';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Avatar', schema: AvatarSchema }]),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, RabbitMQService],
})
export class UserModule {}
