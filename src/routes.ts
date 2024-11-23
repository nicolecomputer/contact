import { FastifyInstance } from 'fastify'

interface ContactForm {
    name: string
    email: string
    message: string
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

        // Redirect back to the form with a success message
        return reply.redirect('/thanks')
    })

    server.get('/thanks', async (request, reply) => {
        return reply.sendFile('thanks.html')
    })
}
