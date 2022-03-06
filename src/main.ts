if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true },
  });
  app.use(cookieParser());
  await app.listen(4000, () => {
    console.log('server start at port 4000');
  });
  // app.setGlobalPrefix('api');
  // app.enableCors();
}

bootstrap();

// const server = express();
//
// export const createNestServer = async (expressInstance) => {
//   const app = await NestFactory.create(
//     AppModule,
//     new ExpressAdapter(expressInstance),
//   );
//   // app.setGlobalPrefix('api');
//   // app.enableCors({ origin: true });
//
//   return app.init();
// };
//
// createNestServer(server)
//   .then((v) => console.log('Nest Ready'))
//   .catch((err) => console.error('Nest broken', err));
//
// export const api = functions.https.onRequest(server);
