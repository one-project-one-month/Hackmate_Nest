import request from 'supertest';
import { CreateChatGroupDto } from '../../src/chat-groups/dto/create-chat-group.dto';
import { AddUserIntoGroupDto } from '../../src/chat-group-members/dto/add-user-into-group.dto';
import { closeTestApp, getTestApp } from '../utils/test-app';
import { INestApplication } from '@nestjs/common';

describe('ChatGroupMembers Module - Add User', () => {
  let app: INestApplication;
  let server: any;
  let groupId: number;

  beforeAll(async () => {
    app = await getTestApp();
    server = app.getHttpServer();

    const newGroup: CreateChatGroupDto = {
      name: `Test Group for Member`,
      description: 'E2E test group for member',
      createdByUserId: 1,
    };

    const response = await request(server)
      .post('/api/v1/groups/create_group_with_project_id')
      .set('x-user-id', '1')
      .send(newGroup);

    groupId = Number((response.body as { id: number | string }).id);
  });
  afterAll(async () => {
    await closeTestApp();
  });

  describe('Add User into Group', () => {
    it('should add a user into the group successfully with full payload', () => {
      const addUserDto: AddUserIntoGroupDto = {
        groupId: groupId,
        userId: 2,
        role: 'admin',
        status: 'active',
        lastReadMessageId: 10,
        mutedUntil: new Date(
          Date.now() + 86400000,
        ).toISOString() as unknown as Date, // 1 day later
      };

      return request(server)
        .post('/api/v1/groups/add_user_into_group')
        .set('x-user-id', '1')
        .send(addUserDto)
        .then((res) => {
          if (res.status !== 201) {
            throw new Error(
              `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`,
            );
          }
          const result = res.body as Record<string, any>;
          expect(result.id).toBeDefined();
          expect(Number(result.groupId)).toBe(groupId);
          expect(Number(result.userId)).toBe(addUserDto.userId);
          expect(result.role).toBe(addUserDto.role);
          expect(result.status).toBe(addUserDto.status);
          expect(Number(result.lastReadMessageId)).toBe(
            addUserDto.lastReadMessageId,
          );
          expect(result.joinedAt).toBeDefined();
        });
    });

    it('should fail when required fields are missing', () => {
      return request(server)
        .post('/api/v1/groups/add_user_into_group')
        .set('x-user-id', '1')
        .send({ userId: 2 }) // Missing groupId
        .expect(422);
    });
  });
});
