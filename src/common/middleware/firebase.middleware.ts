import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { FirebaseApp } from '@src/services/firebase/firebase-app';
import { UserService } from '@src/resources/user/user.service';
import { TelegramService } from '@src/services/telegram/telegram.service';

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
  private frbAuth: firebase.auth.Auth;

  constructor(
    private readonly firebaseApp: FirebaseApp,
    private readonly userService: UserService,
    private readonly telegramService: TelegramService,
  ) {
    this.frbAuth = firebaseApp.getAuth();
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.frbAuth
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          const email = decodedToken.email;
          const user = await this.userService.findByEmail(email);
          // if (!user) {
          //   user = await this.userService.create({ email });
          // }
          req['user'] = user;
          console.log('--- firebaseMiddleware user', user);
          const message =
            `--- server ---  /n` +
            `firebaseMiddleware /n` +
            `email: ${user.email}`;
          await this.telegramService.sendMessage(message);
          next();
        })
        .catch((error) => {
          console.error(error);
          this.accessDenied(req.url, res);
        });
    } else {
      next();
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
