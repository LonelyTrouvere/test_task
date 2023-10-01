import { FastifyRequest, FastifyReply } from "fastify"
import { db } from "../db/index"
import { messages } from "../db/schema"
import { fastify } from "../app"

import mime from 'mime-types'
import fs from 'fs'
import util from 'util'
import { pipeline } from "stream"
import { eq, gte } from "drizzle-orm"
const pump = util.promisify(pipeline)

interface TextBody {
    text: string
}

export const textHandler = async (request: FastifyRequest<{ Body: TextBody }>, reply: FastifyReply) => {
    try{
        const auth = request.headers.authorization
        const token = auth.split(' ')[1]
        const decoded = await fastify.jwt.verify(token)
        const result = await db.insert(messages).values({text: request.body.text, userId: decoded.id})

        return { mes: "message sent succsesfuly" }
    } catch (e) {
        return e 
    }
}

export const fileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file()

    const auth = request.headers.authorization
    const token = auth.split(' ')[1]
    const decoded = await fastify.jwt.verify(token)

    await pump(data.file, fs.createWriteStream(`./uploads/${data.filename}`))

    await db.insert(messages).values({filePath: `./uploads/${data.filename}`, userId: decoded.id})

    return { mes: 'file sent succsesfuly' }
}

export const listHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const {limit, coursor} = request.query
    const result = await db.select()
                      .from(messages)
                      .orderBy(messages.id)
                      .limit(limit || 5)
                      .where(gte(messages.id, coursor))
    reply.code(200).send(result)
}

export const contentHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params

    const query = await db.select().from(messages).where(eq(messages.id, id))
    const message = query[0]

    if (query.length === 0)
        reply.code(400).send({mes: "message doesn't exist"})

    const {text, filePath} = message

    if (text)
        reply.code(200).header('content-type', 'text/plain').send(text)

    if (filePath){
        const file = fs.readFileSync(filePath)
        const type = mime.lookup(filePath)
        reply.code(200).header('content-type', type).send(file)
    }

    return { mes: message }
}