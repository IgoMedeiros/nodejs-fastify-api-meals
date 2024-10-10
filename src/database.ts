import knex from "knex"
import { env } from "./env"

export const knexConnectionConfig = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === 'sqlite' ? {
        filename: env.DATABASE_URL
    } : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations',
        extension: 'ts',
    }
}

export const knexConnection = knex(knexConnectionConfig)