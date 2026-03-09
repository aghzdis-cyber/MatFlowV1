import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const materials = await prisma.material.findMany({
            include: {
                category: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(materials);
    } catch (error) {
        console.error("Error fetching materials:", error);
        return NextResponse.json(
            { error: "Failed to fetch materials" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
