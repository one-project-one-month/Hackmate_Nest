import { APP_URL } from '../utils/constants';
import request from 'supertest';

describe('Messages Module - Mark As Read', () => {
  const app = APP_URL;

  it('should return 404 when message does not exist', () => {
    return request(app)
      .post('/api/v1/messages/999999/read')
      .send({ userId: 1 })
      .expect(404);
  });

  it('should fail when userId is missing', () => {
    return request(app)
      .post('/api/v1/messages/999999/read')
      .send({})
      .expect(422);
  });
});
