import { FastifyInstance } from "fastify/types/instance";
import { contentHandler, fileHandler, listHandler, textHandler } from "./messge.handlers";

const textOpt = {
    schema: {
        body: {
            type: 'object',
            properties: {
                text: { type: 'string' }
            },
            required: ['text']
        }
    }
}

export const contentOpt = {
    schema: {
        headers: {
            'content-type': true
        }
    }
}

export const messageRoutes = async (fastify: FastifyInstance) => {

    fastify.post('/text', { ...textOpt, preHandler: [fastify.auth] }, textHandler)
    fastify.post('/file', { preHandler: [fastify.auth] }, fileHandler)

    fastify.get('/list', { preHandler: [fastify.auth] }, listHandler)
    fastify.get('/content/:id', { ...contentOpt, preHandler: [fastify.auth] }, contentHandler)

}