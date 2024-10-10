import { app } from "./app"
import { env } from "./env"

app.listen({
    port: env.PORT,
    host: '0.0.0.0'
}).then(_ => {
    console.log(`Server listening on http://0.0.0.0/${env.PORT}`)
})