// app/utils/prisma.server.ts
import { PrismaClient } from '@prisma/client'

export interface Context {
  prisma: PrismaClient
}

let prisma: PrismaClient
declare global {
  var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
  prisma.$connect().then(() => console.log('Conectou ao Banco'))
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect().then(() => console.log('Conectou ao Banco'))
  }
  prisma = global.__db
}

export const context: Context = {
  prisma
}