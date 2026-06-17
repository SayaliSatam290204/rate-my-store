import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';

describe('POST /api/ratings validation and auth', () => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const validToken = jwt.sign(
    { id: 1, name: 'Test User', email: 'test@example.com', role: 'user' },
    secret
  );

  it('rejects requests without authentication with 401', async () => {
    const res = await request(app).post('/api/ratings').send({
      storeId: 1,
      value: 5,
    });
    expect(res.status).toBe(401);
  });

  it('rejects an invalid rating value with 422 when authenticated', async () => {
    const res = await request(app)
      .post('/api/ratings')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        storeId: 1,
        value: 10, // max is 5
      });
    expect(res.status).toBe(422);
    expect(res.body.errors).toContain('Rating value must be between 1 and 5');
  });

  it('rejects an invalid store ID with 422 when authenticated', async () => {
    const res = await request(app)
      .post('/api/ratings')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        storeId: -5,
        value: 4,
      });
    expect(res.status).toBe(422);
    expect(res.body.errors).toContain('Store ID must be a valid numeric ID');
  });
});
