import fastify from 'fastify'
import cors from '@fastify/cors'
import staticFiles from '@fastify/static'
import path from 'path'
import formBody from '@fastify/formbody'
import 'dotenv/config'

import { formRoutes } from "./routes"

const server = fastify({
    logger: true
})

async function main() {
    await server.register(cors)
    await server.register(formBody)

    await server.register(staticFiles, {
        root: path.join(__dirname, '../public'),
        prefix: '/public/' // adds /public/ prefix to files
    })


    // Register routes
    await server.register(formRoutes)

    // Start the server
    try {
        const port = parseInt(process.env.PORT || '3000', 10)
        const host = process.env.HOST || '0.0.0.0'

        await server.listen({
            port,
            host
        })

        console.log(`Server is running on http://${host}:${port}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

main();
