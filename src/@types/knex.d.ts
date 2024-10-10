import { knex } from 'knex'

declare module 'knex/types/tables' {
    interface Tables {
        meals: {
            id: string
            name: string
            description: string
            date: String
            time: string
            on_diet: boolean
            user_id: string
        }
        users: {
            id: string
            session_id: string
            name: string
            email: string
        }
    }
}