import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const inspections = await prisma.inspection.findMany({
      where: status ? { globalStatus: status } : undefined,
      include: {
        reception: {
          include: {
            supplier: true
          }
        },
        items: {
          include: {
            material: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(inspections);
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { receptionId, inspectorName, globalStatus, comments, items } = data;

    const newInspection = await prisma.inspection.create({
      data: {
        receptionId,
        inspectorName,
        globalStatus: globalStatus || 'PENDING',
        comments,
        items: {
          create: items.map((item: any) => ({
            materialId: item.materialId,
            quantityInspected: parseFloat(item.quantityInspected) || 0,
            quantityRejected: parseFloat(item.quantityRejected) || 0,
            defects: item.defects
          }))
        }
      },
      include: {
        items: true,
        reception: true
      }
    });

    return NextResponse.json(newInspection, { status: 201 });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json({ error: 'Failed to create inspection' }, { status: 500 });
  }
}
