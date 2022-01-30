import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthFrbMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor(private readonly configService: ConfigService) {
    const firebase_params = {
      type: this.configService.get('type'),
      projectId: this.configService.get('project_id'),
      privateKeyId: this.configService.get('private_key_id'),
      privateKey: this.configService.get('private_key').replace(/\\n/g, '\n'),
      clientEmail: this.configService.get('client_email'),
      clientId: this.configService.get('client_id'),
      authUri: this.configService.get('auth_uri'),
      tokenUri: this.configService.get('token_uri'),
      authProviderX509CertUrl: this.configService.get(
        'auth_provider_x509_cert_url',
      ),
      clientC509CertUrl: this.configService.get('client_x509_cert_url'),
    };

    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
      databaseURL: 'https://fir-auth-bd895.firebaseio.com',
    });
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          const user = {
            email: decodedToken.email,
          };
          req['user'] = user;
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
