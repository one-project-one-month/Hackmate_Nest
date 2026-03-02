import { APP_URL } from '../utils/constants';
import request from 'supertest';
import { CreateChatGroupDto } from '../../src/chat-groups/dto/create-chat-group.dto';

describe('Messages Module - Get Group Messages', () => {
  const app = APP_URL;
  let groupId: number;

  beforeAll(async () => {
    const newGroup: CreateChatGroupDto = {
      name: 'Messages Test Group',
      description: 'E2E test group for messages',
      createdByUserId: 1,
      isPrivate: false,
    };

    const response = await request(app)
      .post('/api/v1/groups/create_group_with_project_id')
      .send(newGroup)
      .expect(201);

    groupId = Number((response.body as { id: number }).id);
  });

  it('should return messages for a group with pagination query', () => {
    return request(app)
      .get(`/api/v1/groups/${groupId}/messages?limit=20&offset=1`)
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('should fail for invalid pagination params', () => {
    return request(app)
      .get(`/api/v1/groups/${groupId}/messages?limit=0&offset=-1`)
      .expect(422);
  });
});
