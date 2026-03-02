import { APP_URL } from '../utils/constants';
import request from 'supertest';
import { CreateChatGroupDto } from '../../src/chat-groups/dto/create-chat-group.dto';
import { AddUserIntoGroupDto } from '../../src/chat-group-members/dto/add-user-into-group.dto';

describe('ChatGroupMembers Module - Add User', () => {
  const app = APP_URL;
  let groupId: number;

  beforeAll(async () => {
    const newGroup: CreateChatGroupDto = {
      name: `Test Group for Member`,
      description: 'E2E test group for member',
      createdByUserId: 1,
      isPrivate: false,
    };

    const response = await request(app)
      .post('/api/v1/groups/create_group_with_project_id')
      .send(newGroup);

    groupId = (response.body as { id: number }).id;
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

      return request(app)
        .post('/api/v1/groups/add_user_into_group')
        .send(addUserDto)
        .expect(201)
        .expect(({ body }) => {
          const result = body as Record<string, any>;
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
      return request(app)
        .post('/api/v1/groups/add_user_into_group')
        .send({ userId: 2 }) // Missing groupId
        .expect(400);
    });
  });
});
