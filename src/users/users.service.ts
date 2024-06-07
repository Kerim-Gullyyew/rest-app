import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserFromRegres } from './interfaces/user.interface';
import { Avatar } from './interfaces/user.interface';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from './email.service';
import { RabbitMQService } from './rabbitmq.service';
import { lastValueFrom } from 'rxjs';
import path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Avatar') private readonly avatarModel: Model<Avatar>,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
    private readonly rabbitMQService: RabbitMQService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    await this.emailService.sendEmail(createdUser.email, 'Welcome!', 'Thank you for registering!');
    await this.rabbitMQService.sendEvent('user_created', createdUser);

    return createdUser;
  }

  async getUser(userId: string): Promise<UserFromRegres> {
    const response = await lastValueFrom(this.httpService.get(`https://reqres.in/api/users/${userId}`));
    return response.data.data;
  }

  async getUserAvatar(userId: string): Promise<string> {
    const avatarRecord = await this.avatarModel.findOne({ userId }).exec();
    if (avatarRecord) {
      const imageBuffer = fs.readFileSync(avatarRecord.filePath, 'base64');
      return imageBuffer;
    } else {
      const user = await this.getUser(userId);
      const avatarUrl = user.avatar;
      const response = await lastValueFrom(this.httpService.get(avatarUrl, { responseType: 'arraybuffer' }));
      const imageBuffer = Buffer.from(response.data, 'binary');

      const ext = path.extname(avatarUrl) || '.png';
      const hash = crypto.createHash('md5').update(imageBuffer).digest('hex');
      const filePath = `./avatars/${hash}${ext}`;

      fs.writeFileSync(filePath, imageBuffer);

      const newAvatar = new this.avatarModel({ userId, filePath, hash });
      await newAvatar.save();
      return imageBuffer.toString('base64');
    }
  }




  


  async deleteUserAvatar(userId: string): Promise<void> {
    const avatarRecord = await this.avatarModel.findOne({ userId }).exec();
    if (avatarRecord) {
      fs.unlinkSync(avatarRecord.filePath);
      await this.avatarModel.deleteOne({ userId }).exec();
    }
  }
}
