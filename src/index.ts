import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import staticFiles from '@fastify/static'
import path from 'path'
import formBody from '@fastify/formbody'
import session from '@fastify/session'
import cookie from '@fastify/cookie'

import { isDevelopment } from './config/database'
import { formRoutes } from "./routes"

const server = fastify({
    logger: isDevelopment ? {
        transport: {
            target: 'pino-pretty'
        },
        level: 'debug'
    } : true,
    trustProxy: true
})

async function main() {
    await server.register(cors)
    await server.register(formBody)
    await server.register(cookie)
    await server.register(session, {
        secret: process.env.SESSION_SECRET || 'change-me-in-production',
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7200000,
            path: '/',
            httpOnly: true,
            domain: process.env.NODE_ENV === 'production' ? 'contact.lion.computer' : undefined
        },
        saveUninitialized: false,
        rolling: true
    })

    await server.register(staticFiles, {
        root: path.join(__dirname, '../public'),
        prefix: '/public/' // adds /public/ prefix to files
    })

    server.addHook('onRequest', async (request) => {
        request.log.error('REQUEST:', {
            url: request.url,
            method: request.method,
            cookies: request.headers.cookie,
            session: request.session,
            secure: request.protocol === 'https'
        })
    })

    // Debug hook for all responses
    server.addHook('onResponse', async (request, reply) => {
        request.log.error('RESPONSE:', {
            statusCode: reply.statusCode,
            hasSessionCookie: reply.getHeader('set-cookie'),
            session: request.session,
        })
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
