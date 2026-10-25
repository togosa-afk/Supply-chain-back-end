import { describe, expect, it, beforeAll, beforeEach, afterAll } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../../src/app';
import User from '../../src/models/user';
import sequelize from '../../src/db';
import { UserRole } from '../../src/modules/auth/auth.types';

const app = createApp();
const api = supertest(app);

const validUser = { email: 'update_role_test@example.com', name: 'mohammed', password: '123456789', role: UserRole.CUSTOMER };
const loginUser = { email: validUser.email, password: validUser.password };
const victimUser = { email: 'update_role_victim@example.com', name: 'victim', password: '123456789', role: UserRole.CUSTOMER };

const registerAndLogin = async (user: typeof validUser) => {
    await api.post('/api/auth/register').send(user);
    const res = await api.post('/api/auth/login').send({ email: user.email, password: user.password }).expect(200);
    return res.body.token as string;
};

const getRole = async (email: string) => (await User.findOne({ where: { email } }))?.role;

describe('update role', () => {

    beforeAll(async () => {
        await sequelize.sync();
    });

    beforeEach(async () => {
        await User.destroy({ where: { email: [validUser.email, victimUser.email ] } });
    });

    afterAll(async () => {
        await User.destroy({ where: { email: [validUser.email, victimUser.email] } });
        await sequelize.close();
    });

    it('with valid parameters', async () => {
        await api.post('/api/auth/register').send(validUser);
        const res = await api.post('/api/auth/login').send(loginUser).expect(200)

        const token = res.body.token;

        const res2 = await api.patch('/api/auth/updaterole').set('Authorization', `Bearer ${token}`).send({ email: validUser.email, role: UserRole.MANUFACTURER }).expect(200)
        expect(res2.body).toHaveProperty('message', `Role updated successfully for ${validUser.email}`);
    })


    it('takes the email from the token, not from the body', async () => {
        const attackerToken = await registerAndLogin(validUser);
        await registerAndLogin(victimUser);

        const res = await api
            .patch('/api/auth/updaterole')
            .set('Authorization', `Bearer ${attackerToken}`)
            .send({ email: victimUser.email, role: UserRole.MANUFACTURER });

        expect(await getRole(victimUser.email)).toBe(UserRole.CUSTOMER);

        expect(res.status).toBe(200);
        expect(await getRole(validUser.email)).toBe(UserRole.MANUFACTURER);
        expect(res.body.message).toContain(validUser.email);
        expect(res.body.message).not.toContain(victimUser.email);
    });

    it('rejects the request without a token', async () => {
        await registerAndLogin(victimUser);

        await api
            .patch('/api/auth/updaterole')
            .send({ email: victimUser.email, role: UserRole.MANUFACTURER })
            .expect(401);

        expect(await getRole(victimUser.email)).toBe(UserRole.CUSTOMER);
    });

    it('does not let a normal user promote themselves to admin', async () => {
        const token = await registerAndLogin(validUser);

        const res = await api
            .patch('/api/auth/updaterole')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: validUser.email, role: UserRole.SUPER_ADMIN });

        expect(res.status).toBe(403);
        expect(await getRole(validUser.email)).toBe(UserRole.CUSTOMER);
    });

    it('can\'t update the role to super admin ', async () => {
        const token = await registerAndLogin(validUser);

        const res = await api
            .patch('/api/auth/updaterole')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: validUser.email, role: UserRole.SUPER_ADMIN });

        expect(res.status).toBe(403);
        expect(await getRole(validUser.email)).toBe(UserRole.CUSTOMER);
    });

})