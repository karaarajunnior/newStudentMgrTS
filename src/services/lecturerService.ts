import { PrismaClient, students } from "@prisma/client";

const prisma = new PrismaClient();

const createlecturer = async (name: string, role?: string) => {
	if (!name) {
		throw new Error("name required ");
	}

	const existinglecturer = await prisma.lecturer.findFirst({
		where: {
			name,
		},
	});

	if (existinglecturer) throw new Error("lecturer already exists");

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

export default {
	createlecturer,
};
