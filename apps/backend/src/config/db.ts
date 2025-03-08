import { PrismaClient } from "@prisma/client";

export default function prismaSingleton(){
    return new PrismaClient();
}