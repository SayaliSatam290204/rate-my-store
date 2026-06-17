import request from 'supertest';
import app from '../app';

describe('POST /api/auth/register', () => {
  it('rejects a name shorter than 20 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Short Name',
      email: 'test@example.com',
      address: '123 Main St',
      password: 'Valid1234!',
    });
    expect(res.status).toBe(422);
  });

  it('rejects a password with no special character', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A Sufficiently Long Test Name',
      email: 'test2@example.com',
      address: '123 Main St',
      password: 'NoSpecial123',
    });
    expect(res.status).toBe(422);
  });
});
