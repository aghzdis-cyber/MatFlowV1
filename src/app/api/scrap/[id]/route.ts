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

    const updated = await prisma.scrapBatch.update({
      where: { id: params.id },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating scrap batch:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
