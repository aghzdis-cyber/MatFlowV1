import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const receptions = await prisma.reception.findMany({
            include: {
                supplier: true,
                location: true,
                items: {
                    include: {
                        material: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(receptions);
    } catch (error) {
        console.error("Error fetching receptions:", error);
        return NextResponse.json(
            { error: "Failed to fetch receptions" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            receptionNumber,
            supplierId,
            locationId,
            deliveryDate,
            driverName,
            truckNumber,
            notes,
            items,
        } = body;

        const newReception = await prisma.reception.create({
            data: {
                receptionNumber,
                supplierId,
                locationId,
                deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
                driverName,
                truckNumber,
                notes,
                items: {
                    create: items.map((item: any) => ({
                        materialId: item.materialId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        batchNumber: item.batchNumber,
                    })),
                },
            },
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

        return NextResponse.json(newReception, { status: 201 });
    } catch (error) {
        console.error("Error creating reception:", error);
        return NextResponse.json(
            { error: "Failed to create reception" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
