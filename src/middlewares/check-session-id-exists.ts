import { FastifyReply, FastifyRequest } from "fastify"
import { knexConnection } from "../database"

export async function checkSessionIsExists(req: FastifyRequest, res: FastifyReply) {
    const sessionId = req.cookies.sessionId

    if(!sessionId) {
        return res.status(401).send({
            error: 'Unauthorized'
        })
    }

    const user = await knexConnection('users')
        .where('session_id', sessionId)
        .first()

    if(!user) {
        return res.status(403).send({
            error: 'Forbidden'
        })
    }

    req.user = user // Add user to request object for further use
}