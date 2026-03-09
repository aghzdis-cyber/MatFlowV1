import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const inventories = await prisma.inventory.findMany({
            include: {
                material: {
                    include: {
                        category: true
                    }
                },
                location: {
                    include: {
                        site: true
                    }
                }
            },
            orderBy: {
                material: {
                    name: 'asc'
                }
            }
        });

        return NextResponse.json(inventories);
    } catch (error) {
        console.error("Error fetching inventories:", error);
        return NextResponse.json(
            { error: "Failed to fetch inventories" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
