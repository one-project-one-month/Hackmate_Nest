import request from 'supertest';
import { CreateChatGroupDto } from '../../src/chat-groups/dto/create-chat-group.dto';
import { closeTestApp, getTestApp } from '../utils/test-app';
import { INestApplication } from '@nestjs/common';
import type { Server } from 'http';

describe('Messages Module - Get Group Messages', () => {
  let app: INestApplication;
  let server: Server;
  let groupId: number;

  beforeAll(async () => {
    app = await getTestApp();
    server = app.getHttpServer() as unknown as Server;

    const newGroup: CreateChatGroupDto = {
      name: 'Messages Test Group',
      description: 'E2E test group for messages',
      createdByUserId: 1,
    };

    const response = await request(server)
      .post('/api/v1/groups/create_group_with_project_id')
      .set('x-user-id', '1')
      .send(newGroup)
      .expect(201);

    groupId = Number((response.body as { id: number }).id);

    await request(server)
      .post('/api/v1/groups/add_user_into_group')
      .set('x-user-id', '1')
      .send({ groupId, userId: 1 })
      .expect(201);
  });
  afterAll(async () => {
    await closeTestApp();
  });

  it('should return messages for a group with pagination query', () => {
    return request(server)
      .get(`/api/v1/groups/${groupId}/messages?limit=20&offset=1`)
      .set('x-user-id', '1')
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('should fail for invalid pagination params', () => {
    return request(server)
      .get(`/api/v1/groups/${groupId}/messages?limit=0&offset=-1`)
      .set('x-user-id', '1')
      .expect(422);
  });
});
