import { jest } from '@jest/globals';
import request from 'supertest';
import app from './app.js';

const mockDb = {
  command: jest.fn().mockResolvedValue({ ok: 1 }),
  collection: () => ({
    find: () => ({ toArray: jest.fn().mockResolvedValue([{ task: 'Test' }]) }),
    insertOne: jest.fn().mockResolvedValue({}),
  }),
};

app.locals.db = mockDb;

describe('API Routes', () => {
  test('/health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.db).toBe('connected');
  });

  test('/api/todos returns todos', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ task: 'Test' }]);
  });

  test('/api/todos POST adds todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ task: 'New Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.task).toBe('New Task');
  });

  test('/health returns 500 on ping failure', async () => {
    app.locals.db.command = jest.fn().mockRejectedValue(new Error('Ping failed'));
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(500);
    expect(res.body.db).toBe('disconnected');
  });

  test('/api/todos returns 500 on fetch error', async () => {
    app.locals.db.collection = () => ({
      find: () => ({ toArray: jest.fn().mockRejectedValue(new Error('DB error')) }),
    });
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Failed to fetch todos');
  });

  test('/api/todos POST returns 500 on insert error', async () => {
    app.locals.db.collection = () => ({
      insertOne: jest.fn().mockRejectedValue(new Error('Insert error')),
    });
    const res = await request(app)
      .post('/api/todos')
      .send({ task: 'New Task' });
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Failed to add todo');
  });
});
