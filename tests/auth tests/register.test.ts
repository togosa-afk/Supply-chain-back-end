import { describe, expect, it, beforeEach, afterAll } from 'vitest';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { createApp } from '../../src/app';
import User from '../../src/models/user';
import sequelize from '../../src/db';
import { UserRole } from '../../src/modules/auth/auth.types';
  

const app = createApp();
const api = supertest(app);

const validUser = { email: 'test@example.com', name: 'mohammed', password: '123456789',role: UserRole.CUSTOMER };

const { name, ...missingName } = validUser;

describe('register', () => {

  beforeEach(async () => {
    await User.destroy({ where: { email: 'test@example.com' } });
  });

  afterAll(async () => {
    await User.destroy({ where: { email: 'test@example.com' } });
    await sequelize.close();
  });

  it('Register user with correct information', async () => {
    const res = await api.post('/api/auth/register').send(validUser)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('message', 'User registered successfully')
  })

  it('register with email already exists', async () => {

    await api.post('/api/auth/register').send(validUser)

    const res = await api.post('/api/auth/register').send(validUser)

    expect(res.status).toBe(409)
    expect(res.body).toHaveProperty('message', 'Email already exists')
  })

  it('register with missing input', async () => {
    const res = await api.post('/api/auth/register').send(missingName)

    expect(res.status).toBe(400)
    expect(res.body).not.toHaveProperty('name')
    expect(res.body).toHaveProperty('errors')
    expect(JSON.stringify(res.body.errors)).toContain('name');
  })

  it('register with invalide email', async () => {
    const invalidEmail = { ...validUser, email: 'invalid-email' };
    const res = await api.post('/api/auth/register').send(invalidEmail)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message', 'Invalid email format')
    expect(res.body).toHaveProperty('errors')
  })

  it('register with short password', async () => {
    const invalidPassword = { ...validUser, password: '123' };
    const res = await api.post('/api/auth/register').send(invalidPassword)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message', 'Password must be at least 6 characters')
  })

  it("ensure passowrd is hashed", async () => {
    const res = await api.post('/api/auth/register').send(validUser)
    expect(res.status).toBe(201)
    const user = await User.findOne({ where: { email: validUser.email } })
    expect(user?.password).not.toBe(validUser.password)
    expect(res.body).toHaveProperty('message', 'User registered successfully')
    expect(res.body).not.toHaveProperty('password')
    expect(await bcrypt.compare(validUser.password, user!.password)).toBe(true);
  })

  it('should register user with CUSTOMER role when no role is provided', async () => {
    const res = await api.post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    const user = await User.findOne({ where: { email: validUser.email } });
    expect(user?.role).toBe(UserRole.CUSTOMER);
  });

  it('should refuse role SUPER_ADMIN ', async () => {
    const res = await api.post('/api/auth/register').send({ ...validUser, role: UserRole.SUPER_ADMIN });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Cannot assign SUPER_ADMIN role');
  });
});