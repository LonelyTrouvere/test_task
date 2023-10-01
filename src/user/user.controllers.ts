import { FastifyRequest, FastifyReply } from "fastify";
import { loginHandler, registerHandler } from "./user.handlers";

export const registerOpt = {
    schema: {
        body: {
            type: "object",
            properties: {
                fullName: { type: 'string' },
                email: {
                    type: 'string',
                    pattern: '[a-z0-9]+@[a-z]+\.[a-z]{2,3}'
                },
                password: { type: 'string' }
            },
            required: ['fullName', 'email', 'password']
        }
    },
    handler: registerHandler
}

export const loginOpt = {
    schema: {
        body: {
            type: "object",
            properties: {
                email: {
                    type: 'string',
                    pattern: '[a-z0-9]+@[a-z]+\.[a-z]{2,3}'
                },
                password: {type: 'string'}
            },
            required: ['email', 'password']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    id: {type: 'number'},
                    email: {type: 'string'},
                    name: {type: 'string'}, 
                    token: {type: 'string'}
                }
            }
        }
    },
    handler: loginHandler
}