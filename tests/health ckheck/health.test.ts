// test user registeration
import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import {createApp} from '../../src/app'

describe('check health of spplication', ()=>{
    it('connect and health cheack', async()=>{
        const app = createApp()
        const response = await supertest(app).get('/health')
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status:'ok',
            service:'SupplyChain Marketplace API'
        })
    })
})