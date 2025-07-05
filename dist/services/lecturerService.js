"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createlecturer = async (name, role) => {
    if (!name) {
        throw new Error("name required ");
    }
    const existinglecturer = await prisma.lecturer.findFirst({
        where: {
            name,
        },
    });
    if (existinglecturer)
        throw new Error("lecturer already exists");
    return await prisma.lecturer.create({
        data: {
            name,
            role,
        },
        select: {
            id: true,
            name: true,
            created_at: true,
            role: true,
        },
    });
};
exports.default = {
    createlecturer,
};
