import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { FirebaseApp } from '@src/firebase/firebase-app';
import { UserService } from '@src/user/user.service';

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
  private frbAuth: firebase.auth.Auth;

  constructor(
    private readonly firebaseApp: FirebaseApp,
    private readonly userService: UserService,
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
          let user = await this.userService.findByEmail(email);
          if (!user) {
            user = await this.userService.create({ email });
          }
          req['user'] = user;
          console.log('--- firebaseMiddleware user', user);
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
