import { FastifyRequest, FastifyReply } from "fastify"
import bcrypt from 'bcrypt'
import { db } from "../db/index"
import { users } from "../db/schema"
import { eq } from "drizzle-orm"
import { fastify } from "../app"

interface LoginBodyType{
    email: string,
    password: string
}

export const loginHandler = async (request: FastifyRequest<{ Body: LoginBodyType }>, reply: FastifyReply) => {
    const { email, password } = request.body

    const user = await db.select().from(users).where(eq(users.email, email))
    if (user.length === 0) 
        reply.code(400).send({msg: 'email or password incorrect'})

    const { hash, ...rest } = user[0]
    
    const passVerification = await bcrypt.compare(password, hash)
    if (!passVerification)
        reply.code(400).send({msg: 'email or password incorrect'})

    const token = 'Bearer ' + fastify.jwt.sign(rest)

    reply.code(200).send({ ...rest, token })
}

interface RegisterBodyType {
    fullName: string,
    email: string,
    password: string,
}

export const registerHandler = async (request: FastifyRequest<{ Body: RegisterBodyType }>, reply: FastifyReply) => {
    const { fullName, email, password } = request.body
    const hash = await bcrypt.hash(password, 10)
    const user = {
        fullName,
        email,
        hash,
    }

    const result = await db.insert(users).values(user).returning({ id: users.id, name: users.fullName, email: users.email })

    reply.code(201).send({ ...result })
}