import { APP_URL } from '../utils/constants';
import request from 'supertest';
import { CreateChatGroupDto } from '../../src/chat-groups/dto/create-chat-group.dto';

describe('ChatGroups Module - Create Only', () => {
  const app = APP_URL;

  describe('Create Chat Group', () => {
    const newGroup: CreateChatGroupDto = {
      name: `Test Group`,
      description: 'E2E test group',
      createdByUserId: 1, // Example ID
      isPrivate: false,
    };

    it('should create a new chat group successfully', () => {
      return request(app)
        .post('/api/v1/groups/create_group_with_project_id')
        .send(newGroup)
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.name).toBe(newGroup.name);
          expect(body.description).toBe(newGroup.description);
          expect(body.createdByUserId).toBe(newGroup.createdByUserId);
          expect(body.isPrivate).toBe(newGroup.isPrivate);
        });
    });

    it('should fail when required fields are missing', () => {
      return request(app)
        .post('/api/v1/groups/create_group_with_project_id')
        .send({}) // empty payload
        .expect(400); // validation error
    });
  });
});
