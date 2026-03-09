import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const flows = await prisma.flow.findMany({
            include: {
                material: true,
                sourceLocation: true,
                destLocation: true,
                events: {
                    include: {
                        user: {
                            select: { name: true, role: true }
                        }
                    },
                    orderBy: {
                        timestamp: 'desc'
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json(flows);
    } catch (error) {
        console.error("Error fetching flows:", error);
        return NextResponse.json(
            { error: "Failed to fetch flows" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
