import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const batches = await prisma.scrapBatch.findMany({
      include: {
        provider: true,
        items: {
          include: {
            material: true,
            location: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { providerId, certificateNumber, totalWeight, notes, items } = data; // items = [{ materialId, locationId, quantity }]

    const newBatch = await prisma.scrapBatch.create({
      data: {
        providerId,
        certificateNumber,
        totalWeight: parseFloat(totalWeight) || 0,
        notes,
        items: {
          create: items.map((item: any) => ({
            materialId: item.materialId,
            locationId: item.locationId,
            quantity: parseFloat(item.quantity)
          }))
        }
      },
      include: { items: true, provider: true }
    });

    return NextResponse.json(newBatch, { status: 201 });
  } catch (error) {
    console.error('Scrap error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
