import { PrismaClient } from "@prisma/client";
import env from "../../env.js";

const prisma=new PrismaClient({
    // log:env.NODE_ENV=="dev"?["query"]:undefined
})

export default prisma;