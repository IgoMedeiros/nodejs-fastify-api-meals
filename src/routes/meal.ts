import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"
import z from 'zod'
import { knexConnection } from "../database"
import { checkSessionIsExists } from "../middlewares/check-session-id-exists"

export async function mealsRoutes(app: FastifyInstance) {
    app.get('/', {
        preHandler: [
            checkSessionIsExists
        ]
    }, async (req, res) => {
        const userId = req.user?.id

        if(!userId) {
            return res.status(401).send({
                error: 'Unauthorized'
            })
        }

        const meals = await knexConnection('meals')
            .where('user_id', userId)
            .select()

        return res.send({meals})
    })

    app.get('/:id', {
        preHandler: [
            checkSessionIsExists
        ]
    }, async (req, res) => {
        const getMealParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const userId = req.user?.id

        const { id } = getMealParamsSchema.parse(req.params)

        const meal = await knexConnection('meals')
            .where({
                id,
                user_id: userId,
            }).first()

        if (!meal) {
            return res.status(404).send()
        }

        return res.send({meal})
    })

    app.put('/:id', {
        preHandler: [
            checkSessionIsExists
        ]
    }, async (req, res) => {
        const updateMealParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const userId = req.user?.id

        const { id } = updateMealParamsSchema.parse(req.params)

        const updateMealBodySchema = z.object({
            name: z.string().min(1).max(200),
            description: z.string().min(1).max(2000),
            date: z.string().date(),
            time: z.string().time(),
            on_diet: z.coerce.boolean(),
        })

        const { name, description, date, time, on_diet } = updateMealBodySchema.parse(req.body)

        await knexConnection('meals')
            .where({
                id,
                user_id: userId,
            }).update({
                name,
                description,
                date,
                time,
                on_diet,
            })

        return res.send()
    })

    app.post('/', {
        preHandler: [
            checkSessionIsExists
        ]
    }, async (req, res) => {
        const createMealBodySchema = z.object({
            name: z.string().min(1).max(200),
            description: z.string().min(1).max(2000),
            date: z.string().date(),
            time: z.string().time(),
            on_diet: z.coerce.boolean(),
        })
        
        const { name, description, date, time, on_diet } = createMealBodySchema.parse(req.body)
        const userId = req.user?.id

        await knexConnection('meals').insert({
            id: randomUUID(),
            name,
            description,
            date,
            time,
            on_diet,
            user_id: userId,
        })

        return res.status(201).send()
    })

    app.delete('/:id', {
        preHandler: [
            checkSessionIsExists
        ]
    }, async (req, res) => {
        const deleteMealParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const userId = req.user?.id

        const { id } = deleteMealParamsSchema.parse(req.params)

        await knexConnection('meals')
            .where({
                id,
                user_id: userId,
            }).delete()

        return res.send()
    })

    app.get('/metrics', {
        preHandler: [
            checkSessionIsExists
        ]
    }, async ( req, res ) => {
        const userId = req.user?.id

        const totalMeals = await knexConnection('meals')
           .where('user_id', userId)
           .orderBy('date')
           .select()

        const totalMealsOnDiet = await knexConnection('meals')
           .where({
                user_id: userId,
                on_diet: true,
            })
           .count('*', { as: 'total'})
           .first()

        const totalMealsNotOnDiet = await knexConnection('meals')
           .where({
                user_id: userId,
                on_diet: false,
            })
           .count('*', { as: 'total'})
           .first()

        const { bestMealSequence } = totalMeals.reduce((acc, meal) => {
            if(meal.on_diet === true) {
                acc.currentMealSequence += 1
            } else {
                acc.currentMealSequence = 0
            }

            if(acc.currentMealSequence > acc.bestMealSequence) {
                acc.bestMealSequence = acc.currentMealSequence
            }

            return acc

        }, { bestMealSequence: 0, currentMealSequence: 0 })

        return res.send({ 
            totalMeals: totalMeals.length, 
            totalMealsOnDiet: totalMealsOnDiet?.total, 
            totalMealsNotOnDiet: totalMealsNotOnDiet?.total,
            bestMealSequence
        })
    })
}
