import { FastifyInstance } from "fastify"
import z from 'zod'
import { knexConnection } from "../database"
import { randomUUID } from "crypto"

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (req, res) => {
        const createUserBodySchema = z.object({
            email: z.string().email(),
            name: z.string(),
        })

        let { sessionId } = req.cookies

        if (!sessionId) {
            sessionId = randomUUID()
            res.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }
        
        const { email, name } = createUserBodySchema.parse(req.body)

        const userEmail = await knexConnection('users')
            .where('email', email).first()

        if (userEmail) {
            return res.status(409).send('Email already exists')
        }

        await knexConnection('users').insert({
            id: randomUUID(),
            name,
            email,
            session_id: sessionId,
        })

        return res.status(201).send()
    })

    app.get('/', async (req, res) => {
        const { sessionId } = req.cookies

        const users = await knexConnection('users')
           .where('session_id', sessionId)
           .select()

        return res.send({ users })
    })
}