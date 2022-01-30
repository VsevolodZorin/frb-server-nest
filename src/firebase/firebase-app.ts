import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseApp {
  private firebaseApp: firebase.app.App;

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

    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
      // databaseURL: '',
    });
  }

  getAuth = (): firebase.auth.Auth => {
    return this.firebaseApp.auth();
  };

  // firestore = (): firebase.firestore.Firestore => {
  //   return this.firebaseApp.firestore();
  // }
}
