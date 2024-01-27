import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('handle a signup request', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'dimas.B.susilo@gmail.com', password: 'Password123!!!' })
      .expect(201);

    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(email);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'dbs@gmail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'Password123!!!' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
