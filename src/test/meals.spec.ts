import { afterAll, beforeAll, describe, expect, test, beforeEach } from "vitest";
import { app } from "../app";
import { execSync } from "node:child_process";
import request from "supertest"

describe('Meals routes', () => {
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

    test('should register a meal', async () => {
        const user = await request(app.server).post('/users').send({
            name: 'Igo Medeiros',
            email: 'meedeiros.paixao@paixao.com',
        }).expect(201)

        const cookie = user.get('Set-Cookie')!

        const meal = await request(app.server).post('/meals').send({
            description: "Lunch with rice, vegetables and meat",
            name: "lunch on diet",
            date: "2024-10-09",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie)

        expect(meal.status).toBe(201)
    })

    test('should list all meals', async () => {
        const user = await request(app.server).post('/users').send({
            name: 'Example',
            email: 'igo.medeiros@example.com',
        }).expect(201)

        const cookie = user.get('Set-cookie')!

        await request(app.server).post('/meals').send({
            description: "Lunch with rice, vegetables and meat",
            name: "Lunch on diet",
            date: "2024-10-09",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        await request(app.server).post('/meals').send({
            description: "Dinner with rice, vegetables and meat",
            name: "Dinner on diet",
            date: "2024-10-09",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        const meals = await request(app.server)
           .get('/meals')
           .set('Cookie', cookie)

        expect(meals.body.meals).toHaveLength(2)

        expect(meals.body.meals[0].name).toBe('Lunch on diet')
        expect(meals.body.meals[1].name).toBe('Dinner on diet')
    })

    test('should update a meal', async () => {
        const user = await request(app.server).post('/users').send({
            name: 'Igo Medeiros',
            email: 'igo.medeiros@paixao.com',
        }).expect(201)

        const cookie = user.get('Set-Cookie')!

        await request(app.server).post('/meals').send({
            description: "Lunch with rice, vegetables and meat",
            name: "Lunch on diet",
            date: "2024-10-09",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        const meals = await request(app.server)
           .get('/meals')
           .set('Cookie', cookie)

        const updatedMeal = await request(app.server)
           .put(`/meals/${meals.body.meals[0].id}`)
           .send({
                ...meals.body.meals[0],
                description: "The lunch a blow of vegetables"
            }).set('Cookie', cookie).expect(200)

        const updatedMeals = await request(app.server)
            .get('/meals')
            .set('Cookie', cookie)

        expect(updatedMeals.body.meals[0].description).toBe("The lunch a blow of vegetables")
    })

    test('should delete a meal', async() => {
        const user = await request(app.server).post('/users').send({
            name: 'Igo Medeiros',
            email: 'igo.medeiros@paixao.com',
        }).expect(201)

        const cookie = user.get('Set-cookie')!

        await request(app.server).post('/meals').send({
            description: "Lunch with rice, vegetables and meat",
            name: "Lunch on diet",
            date: "2024-10-09",
            time: "12:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        await request(app.server).post('/meals').send({
            description: "Dinner with rice, vegetables and meat",
            name: "Dinner on diet",
            date: "2024-10-09",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        const meals = await request(app.server)
           .get('/meals')
           .set('Cookie', cookie)

        expect(meals.body.meals).toHaveLength(2)

        await request(app.server)
           .delete(`/meals/${meals.body.meals[0].id}`)
           .set('Cookie', cookie).expect(200)

        const mealWithDeletedMeal = await request(app.server)
           .get('/meals')
           .set('Cookie', cookie)

           expect(mealWithDeletedMeal.body.meals).toHaveLength(1)
           expect(mealWithDeletedMeal.body.meals[0].name).toBe('Dinner on diet')
    })

    test('should be possible get metrics', async () => {
        const user = await request(app.server).post('/users').send({
            name: 'Igo Medeiros',
            email: 'igo.medeiros@paixao.com',
        }).expect(201)

        const cookie = user.get('Set-cookie')!

        await request(app.server).post('/meals').send({
            description: "Lunch with rice, vegetables and meat",
            name: "Lunch on diet",
            date: "2024-10-09",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        await request(app.server).post('/meals').send({
            description: "Dinner with rice, vegetables and meat",
            name: "Dinner on diet",
            date: "2024-10-08",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        await request(app.server).post('/meals').send({
            description: "Lunch with rice, vegetables and meat",
            name: "Lunch on diet",
            date: "2024-10-09",
            time: "17:25:00",
            on_diet: false,
        }).set('Cookie', cookie).expect(201)

        await request(app.server).post('/meals').send({
            description: "Dinner with rice, vegetables and meat",
            name: "Dinner on diet",
            date: "2024-10-08",
            time: "17:25:00",
            on_diet: false,
        }).set('Cookie', cookie).expect(201)

        await request(app.server).post('/meals').send({
            description: "Dinner with rice, vegetables and meat",
            name: "Dinner on diet",
            date: "2024-10-08",
            time: "17:25:00",
            on_diet: true,
        }).set('Cookie', cookie).expect(201)

        const metrics = await request(app.server)
            .get('/meals/metrics')
            .set('Cookie', cookie)

        expect(metrics.body).toEqual(
            expect.objectContaining({
                totalMeals: 5,
                totalMealsOnDiet: 3,
                totalMealsNotOnDiet: 2,
                bestMealSequence: 0
            })
        )
    })
})