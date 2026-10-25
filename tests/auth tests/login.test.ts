import { describe, expect, it, beforeAll, beforeEach, afterAll } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../../src/app';
import User from '../../src/models/user';
import sequelize from '../../src/db';
import { UserRole } from '../../src/modules/auth/auth.types';

const app = createApp();
const api = supertest(app);

const validUser = { email: 'login_test@example.com', name: 'mohammed', password: '123456789', role: UserRole.CUSTOMER };
const loginUser = { email: validUser.email, password: validUser.password };

describe('login test', () => {
    beforeAll(async () => {
        await sequelize.sync();
    });

    beforeEach(async () => {
        await User.destroy({ where: { email: validUser.email } });
    });

    afterAll(async () => {
        await User.destroy({ where: { email: validUser.email } });
        await sequelize.close();
    });

    it('login test with correct information', async () => {
        await api.post('/api/auth/register').send(validUser);

        const res = await api.post('/api/auth/login').send(loginUser);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).not.toHaveProperty('password')
        expect(res.body.user).toHaveProperty('email', loginUser.email);
    });

    it('login with incorrect password', async () => {
        await api.post('/api/auth/register').send(validUser);
        
        const res = await api.post('/api/auth/login').send({ ...loginUser, password: 'wrongpassword' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    })

    it('login with unregisted email', async () => {
        const res = await api.post('/api/auth/login').send({email:"example@example.com", password:"password"})

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'User not found')
    })

    it("login with wrong email format", async () => {
        const res = await api.post('/api/auth/login').send({email: "exm", password: "password123"})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', 'Invalid email format')
    })

    it("login with empty email", async () => {
        const res = await api.post('/api/auth/login').send({email: "", password: "password"})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', 'Invalid email format')
    })

    it("login with empty password", async () => {
        const res = await api.post('/api/auth/login').send({email: validUser.email, password: ""})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', 'Password is required')
    })

    it("login with missing body", async () =>{
        const res = await api.post('/api/auth/login').send({})
        expect(res.status).toBe(400)
    })
})