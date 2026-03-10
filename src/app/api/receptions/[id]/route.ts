import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const reception = await prisma.reception.findUnique({
            where: { id: params.id },
            include: {
                supplier: true,
                location: true,
                items: {
                    include: {
                        material: true,
                    },
                },
            },
        });

        if (!reception) {
            return NextResponse.json({ error: "Reception not found" }, { status: 404 });
        }

        return NextResponse.json(reception);
    } catch (error) {
        console.error("Error fetching reception:", error);
        return NextResponse.json(
            { error: "Failed to fetch reception" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status } = body;

        // Fetch the existing reception to check its current status
        const existingReception = await prisma.reception.findUnique({
            where: { id: params.id },
            include: { items: true },
        });

        if (!existingReception) {
            return NextResponse.json({ error: "Reception not found" }, { status: 404 });
        }

        // Only allow inventory update if we transition from PENDING to VALIDATED
        if (status === "VALIDATED" && existingReception.status === "PENDING") {
            // Use transaction to update inventory and status safely
            const updatedReception = await prisma.$transaction(async (tx) => {
                // For each item, update or create inventory record
                for (const item of existingReception.items) {
                    const existingInventory = await tx.inventory.findFirst({
                        where: {
                            materialId: item.materialId,
                            locationId: existingReception.locationId,
                            batchNumber: item.batchNumber || null,
                        },
                    });

                    if (existingInventory) {
                        await tx.inventory.update({
                            where: { id: existingInventory.id },
                            data: { quantity: existingInventory.quantity + item.quantity },
                        });
                    } else {
                        await tx.inventory.create({
                            data: {
                                materialId: item.materialId,
                                locationId: existingReception.locationId,
                                quantity: item.quantity,
                                batchNumber: item.batchNumber,
                            },
                        });
                    }
                }

                return await tx.reception.update({
                    where: { id: params.id },
                    data: { status },
                    include: {
                        supplier: true,
                        location: true,
                        items: { include: { material: true } },
                    },
                });
            });

            return NextResponse.json(updatedReception);
        }

        // Just update status if not validating
        const updatedReceptionInfo = await prisma.reception.update({
            where: { id: params.id },
            data: { status },
            include: {
                supplier: true,
                location: true,
                items: { include: { material: true } },
            },
        });

        return NextResponse.json(updatedReceptionInfo);
    } catch (error) {
        console.error("Error updating reception status:", error);
        return NextResponse.json(
            { error: "Failed to update reception status" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
