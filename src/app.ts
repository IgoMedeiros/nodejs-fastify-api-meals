import fastify from 'fastify'
import { mealsRoutes } from './routes/meal'
import fastifyCookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(fastifyCookie)

app.register(mealsRoutes, {
    prefix: '/meals'
})

app.register(usersRoutes, {
    prefix: '/users'
})