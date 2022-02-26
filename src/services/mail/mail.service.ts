import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(to: string) {
    // const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to project-dev-way! Confirm your Email',
      template: 'confirmReg', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        // name: user.name,
        // url,
      },
    });
  }
}
