import express from 'express';
import http from 'http';
import { start } from './app.js';
import env from './env.js';
import prisma from './apps/database/db.conntection.js';
// import { PrismaClient } from '@prisma/client';

const StartServer = async () => {
    // const prisma = new PrismaClient();
    const app = express();
    const server = http.createServer(app);
    await prisma.$connect();
    await start(app)
    server.listen(env.PORT, () => {
        console.log("⚙️  Application is running on port : " + env.PORT);
    }).on('error', (err) => {
        console.log(err)
        prisma.$disconnect()
        process.exit(1)
    })
}
StartServer()
