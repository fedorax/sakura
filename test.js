const request = require('supertest');
const app = require('./server');
const pool = require('./middleware/pg');

let client;
beforeAll(async () => {
    client = await pool.connect(); // プールからクライアントを取得
    client.query("DELETE From users WHERE email = 'testuser'");
});

afterAll(async () => {
    client.query("DELETE From users WHERE email = 'testuser'");
    client.release();
});
describe('User Authentication System', () => {
  let refreshToken = '';

  // 新規登録のテスト
  test('It should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'testuser', password: 'password123' });

    expect(response.statusCode).toBe(201);
  });

  // ログインのテスト
  test('It should login an existing user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'testuser', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    refreshToken = response.body.refreshToken; // リフレッシュトークンを後のテストで使用
  });

  // トークン検証のテスト
  test('It should verify an access token', async () => {
    const loginResponse = await request(app).post('/login').send({ email: 'testuser', password: 'password123' });
    const accessToken = loginResponse.body.accessToken;

    const response = await request(app)
      .get('/verify')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('valid', true);
  });

  // アクセストークンのリフレッシュテスト
  test('It should refresh an access token', async () => {
    const response = await request(app)
      .post('/refresh')
      .send({ refreshToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });
});
