import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        return NextResponse.json(
            { error: "Failed to fetch suppliers" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, contact, email, phone, address } = body;

        const newSupplier = await prisma.supplier.create({
            data: {
                name,
                contact,
                email,
                phone,
                address,
            },
        });

        return NextResponse.json(newSupplier, { status: 201 });
    } catch (error) {
        console.error("Error creating supplier:", error);
        return NextResponse.json(
            { error: "Failed to create supplier" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
