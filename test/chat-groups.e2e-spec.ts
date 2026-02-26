import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('ChatGroupsController (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/api/v1/chat-groups (POST) - should create a chat group', () => {
        const createDto = {
            name: 'Test Group',
            description: 'Test Description',
            createdByUserId: 1,
            isPrivate: false,
        };

        return request(app.getHttpServer())
            .post('/api/v1/chat-groups')
            .send(createDto)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.name).toBe(createDto.name);
                expect(res.body.description).toBe(createDto.description);
                expect(res.body.createdByUserId).toBe(createDto.createdByUserId.toString()); // TypeORM returns bigint as string
            });
    });

    it('/api/v1/chat-groups (POST) - should fail if name is missing', () => {
        const createDto = {
            description: 'Test Description',
            createdByUserId: 1,
        };

        return request(app.getHttpServer())
            .post('/api/v1/chat-groups')
            .send(createDto)
            .expect(400);
    });
});
