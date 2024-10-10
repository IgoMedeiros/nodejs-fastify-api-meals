import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { app } from '../app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Users routes', () => {
    beforeAll( async () => {
        await app.ready()
    })

    afterAll( async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('yarn knex migrate:rollback --all')
        execSync('yarn knex migrate:latest')
    })

    test('should create a user', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
        }).expect(201)

        const cookie = response.get('Set-Cookie')

        expect(cookie).toEqual(
            expect.arrayContaining([expect.stringContaining('sessionId')])
        )
    })

    test('should list all users', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'Igo Medeiros',
            email: 'igo.medeiros@paixao.com',
        })

        const cookie = response.get('Set-Cookie')!

        const users = await request(app.server)
            .get('/users')
            .set('Cookie', cookie)

        expect(users.body.users).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Igo Medeiros',
                    email: 'igo.medeiros@paixao.com',
                })
            ])
        )
    })
})