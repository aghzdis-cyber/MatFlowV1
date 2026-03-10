import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { status } = data;

    const current = await prisma.reformRequest.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Validate logic to deduct items heavily protected in transaction
    if (status === 'APPROVED' && current.status !== 'APPROVED') {
       await prisma.$transaction(async (tx) => {
         for (const item of current.items) {
           await tx.inventory.update({
             where: { id: item.inventoryId },
             data: { quantity: { decrement: item.quantity } }
           });
         }
         await tx.reformRequest.update({
           where: { id: params.id },
           data: { status }
         });
       });
       return NextResponse.json({ success: true });
    }

    const updated = await prisma.reformRequest.update({
      where: { id: params.id },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating reform:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
