import { connect } from './db/index'

import { userRoutes } from './user/user.routes'
import { messageRoutes } from './message/message.routes'

import multipart from '@fastify/multipart'
import fjwt from 'fastify-jwt'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
export const fastify = Fastify({
  logger: true
})

declare module "fastify"{
  export interface FastifyInstance{
    auth: any
  }
}

fastify.register(fjwt, {
  secret: "asdsafsdgfhgndhfbsda"
})

fastify.decorate("auth", async (request : FastifyRequest, reply : FastifyReply) => {
  try{
    await request.jwtVerify()
  } catch(e) {
    reply.send(e)
  }
})

fastify.register(multipart)

fastify.register(userRoutes, {prefix: "/user"})
fastify.register(messageRoutes, {prefix: '/message'})

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

const start = async () => {
  try {
    await connect()
    await fastify.listen({ port: 3000, host: "0.0.0.0" })
    console.log("Listening on port 3000...")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()