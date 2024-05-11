import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import env from './env.js'
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiError } from './utils/ApiError.js';
import globalRouter from "./apps/api/index.js";

export const start = (app) => {
    app.use(helmet())
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    if (env.NODE_ENV == "dev") app.use(morgan('dev'))
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 50,
        standardHeaders: 'draft-7',
        legacyHeaders: false
    })
    app.use(limiter)
    app.use(globalRouter);
    app.use((req,res,next)=>{
        throw new ApiError(404,"Api not found")
    })
    app.use((req,res,next)=>{
        req.setTimeout(5000)
        res.setTimeout(5000)
    })
    app.use(errorHandler)
}