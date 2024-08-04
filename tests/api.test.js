const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
    it('should register a user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(201);
    });

    it('should log in a user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});

describe('Document API', () => {
    let token;

    beforeAll(async () => {
        // Assuming login to get a token
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        token = response.body.token;
    });

    it('should create a document', async () => {
        const response = await request(app)
            .post('/api/documents')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', 'path/to/file.txt') // Adjust this path
            .field('title', 'Test Document')
            .field('description', 'A test document');
        expect(response.status).toBe(201);
    });

    it('should get documents', async () => {
        const response = await request(app)
            .get('/api/documents')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
