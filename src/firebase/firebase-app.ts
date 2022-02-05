import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseApp {
  private firebaseApp: firebase.app.App;

  constructor(private readonly configService: ConfigService) {
    const firebase_params = {
      type: this.configService.get('FIREBASE_type'),
      projectId: this.configService.get('FIREBASE_project_id'),
      privateKeyId: this.configService.get('FIREBASE_private_key_id'),
      privateKey: this.configService
        .get('FIREBASE_private_key')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get('FIREBASE_client_email'),
      clientId: this.configService.get('FIREBASE_client_id'),
      authUri: this.configService.get('FIREBASE_auth_uri'),
      tokenUri: this.configService.get('FIREBASE_token_uri'),
      authProviderX509CertUrl: this.configService.get(
        'FIREBASE_auth_provider_x509_cert_url',
      ),
      clientC509CertUrl: this.configService.get(
        'FIREBASE_client_x509_cert_url',
      ),
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
