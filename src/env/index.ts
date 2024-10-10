import { config } from "dotenv"
import { z } from "zod"

if (process.env.NODE_ENV == 'test') {
    config({ path: '.env.test' })
} else {
    config()
}

const envSchema = z.object({
    PORT: z.coerce.number().min(1).max(65535).default(3333),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string()
})

export const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    throw new Error(`Invalid environment variables: ${_env.error.format()}`)
}

export const env = _env.data