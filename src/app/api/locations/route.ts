import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            include: {
                site: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json(
            { error: "Failed to fetch locations" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
