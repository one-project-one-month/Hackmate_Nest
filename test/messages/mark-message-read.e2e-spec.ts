import request from 'supertest';
import { closeTestApp, getTestApp } from '../utils/test-app';
import { INestApplication } from '@nestjs/common';
import type { Server } from 'http';

describe('Messages Module - Mark As Read', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    app = await getTestApp();
    server = app.getHttpServer() as unknown as Server;
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 404 when message does not exist', () => {
    return request(server)
      .post('/api/v1/messages/999999/read')
      .set('x-user-id', '1')
      .send({ userId: 1 })
      .expect(404);
  });

  it('should fail when auth header is missing', () => {
    return request(server)
      .post('/api/v1/messages/999999/read')
      .send({})
      .expect(401);
  });
});
