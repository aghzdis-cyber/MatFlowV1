import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reforms = await prisma.reformRequest.findMany({
      include: {
        items: {
          include: {
            inventory: {
              include: {
                material: true,
                location: true
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(reforms);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { requesterName, reason, items } = data;

    for (const item of items) {
      const inv = await prisma.inventory.findUnique({ where: { id: item.inventoryId } });
      if (!inv || inv.quantity < parseFloat(item.quantity)) {
        return NextResponse.json({ error: 'Quantité insuffisante en stock' }, { status: 400 });
      }
    }

    const newReform = await prisma.reformRequest.create({
      data: {
        requesterName,
        reason,
        items: {
          create: items.map((item: any) => ({
            inventoryId: item.inventoryId,
            quantity: parseFloat(item.quantity)
          }))
        }
      },
      include: { items: true }
    });

    return NextResponse.json(newReform, { status: 201 });
  } catch (error) {
    console.error('Reform error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
