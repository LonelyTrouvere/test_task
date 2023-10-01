import { FastifyInstance } from "fastify/types/instance";
import { loginOpt, registerOpt } from "./user.controllers";

export const userRoutes = async (fastify : FastifyInstance) => {

    fastify.post('/login', loginOpt)
    fastify.post('/register', registerOpt)

}