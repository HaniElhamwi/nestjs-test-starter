import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/model';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url = `example.com/auth/confirm?token=${user.username}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: 'hanialhamwi000000@gmail.com',
      subject: 'Account Verification',
      template: './confirmation',
      context: {
        name: user.username,
        url,
      },
    });
  }
}
