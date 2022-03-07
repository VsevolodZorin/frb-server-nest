import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import { LoginUserDto } from '@src/resources/auth/dto/loginUser.dto';
require('module-alias/register');

const loginDto: LoginUserDto = {
  email: 'test@gmail.com',
  password: 'test',
};

describe('SkillController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.accessToken;
    console.log('--- e2e login', token);
  });

  it('/skills (POST)', async (done) => {
    return request(app.getHttpServer())
      .post('/skills')
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  afterAll(() => {
    disconnect();
  });
});
