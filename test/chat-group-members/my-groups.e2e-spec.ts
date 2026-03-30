import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import type { Server } from 'http';

import { CreateChatGroupDto } from '../../src/chat-groups/dto/create-chat-group.dto';
import { AddUserIntoGroupDto } from '../../src/chat-group-members/dto/add-user-into-group.dto';
import { closeTestApp, getTestApp } from '../utils/test-app';

describe('ChatGroupMembers Module - My Groups', () => {
  let app: INestApplication;
  let server: Server;
  let groupId: number;

  beforeAll(async () => {
    app = await getTestApp();
    server = app.getHttpServer() as unknown as Server;

    const newGroup: CreateChatGroupDto = {
      name: 'My Groups Test',
      description: 'E2E test group for my-groups endpoint',
      createdByUserId: 1,
    };

    const createResponse = await request(server)
      .post('/api/v1/groups/create_group_with_project_id')
      .set('x-user-id', '1')
      .send(newGroup)
      .expect(201);

    groupId = Number((createResponse.body as { id: number | string }).id);

    const addUserDto: AddUserIntoGroupDto = {
      groupId,
      userId: 2,
      role: 'member',
      status: 'unread',
    };

    await request(server)
      .post('/api/v1/groups/add_user_into_group')
      .set('x-user-id', '1')
      .send(addUserDto)
      .expect(201);
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('returns the authenticated users groups', () => {
    return request(server)
      .get('/api/v1/my-groups')
      .set('x-user-id', '2')
      .expect(200)
      .expect(({ body }) => {
        const result = body as Record<string, any>;
        expect(result.userId).toBe(2);
        expect(result.groups).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              groupId,
              groupName: 'My Groups Test',
              status: 'unread',
            }),
          ]),
        );
      });
  });
});
