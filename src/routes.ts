import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import prisma from './lib/prisma'

interface ContactForm {
    name: string
    email: string
    message: string
}

declare module '@fastify/session' {
    interface FastifySessionObject {
        authenticated?: boolean
    }
}

interface LoginBody {
    password: string
}


const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    request.log.info('Session state in requireAuth:', {
        authenticated: request.session.authenticated,
        sessionId: request.session.sessionId
    })

    if (!request.session.authenticated) {
        request.log.info('Not authenticated, redirecting to login')
        return reply.redirect('/login')
    }
}

export async function formRoutes(server: FastifyInstance) {
    server.get('/', async (request, reply) => {
        return reply.sendFile('index.html')
    })

    server.post<{ Body: ContactForm }>('/contact', async (request, reply) => {
        const { name, email, message } = request.body

        // Log the form data
        server.log.info('Form submission received:')
        server.log.info({ name, email, message })

        try {
            // Store in database
            const newMessage = await prisma.message.create({
                data: {
                    name,
                    email,
                    message
                }
            })

            // Log success
            server.log.info('Message stored in database', newMessage)

            return reply.redirect('/thanks')
        } catch (error) {
            server.log.error('Error storing message:', error)
            return reply.redirect('/error')
        }

        // Redirect back to the form with a success message
        return reply.redirect('/thanks')
    })

    server.get('/thanks', async (request, reply) => {
        return reply.sendFile('thanks.html')
    })

    server.get('/error', async (request, reply) => {
        return reply.sendFile('error.html')
    })


    server.get('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        if (request.session.authenticated) {
            return reply.redirect('/messages')
        }
        return reply.sendFile('login.html')
    })

    server.post<{ Body: LoginBody }>('/login', async (request: FastifyRequest<{
        Body: LoginBody
    }>, reply: FastifyReply) => {
        const { password } = request.body

        if (password === process.env.ADMIN_PASSWORD) {
            request.session.authenticated = true
            return reply.redirect('/messages')
        }

        return reply.redirect('/login')
    })

    server.get('/logout', async (request, reply) => {
        request.session.destroy()
        return reply.redirect('/login')
    })

    server.get('/messages', { preHandler: requireAuth }, async () => {
        const messages = await prisma.message.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return messages
    })
}
