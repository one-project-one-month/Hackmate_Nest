import request from 'supertest';
import { CreateChatGroupDto } from '../../src/chat-groups/dto/create-chat-group.dto';
import { closeTestApp, getTestApp } from '../utils/test-app';
import { INestApplication } from '@nestjs/common';

describe('ChatGroups Module - Create Only', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    app = await getTestApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe('Create Chat Group', () => {
    const newGroup: CreateChatGroupDto = {
      name: `Test Group`,
      description: 'E2E test group',
      createdByUserId: 1, // Example ID
    };

    it('should create a new chat group successfully', () => {
      return request(server)
        .post('/api/v1/groups/create_group_with_project_id')
        .set('x-user-id', '1')
        .send(newGroup)
        .expect(201)
        .expect(({ body }) => {
          const result = body as Record<string, any>;
          expect(result.id).toBeDefined();
          expect(result.name).toBe(newGroup.name);
          expect(result.description).toBe(newGroup.description);
          expect(result.createdByUserId).toBe(newGroup.createdByUserId);
        });
    });

    it('should fail when required fields are missing', () => {
      return request(server)
        .post('/api/v1/groups/create_group_with_project_id')
        .set('x-user-id', '1')
        .send({}) // empty payload
        .expect(422); // validation error
    });
  });
});
