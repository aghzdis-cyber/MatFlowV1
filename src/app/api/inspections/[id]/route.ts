import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id },
      include: {
        reception: {
           include: { supplier: true }
        },
        items: {
          include: { material: true }
        }
      }
    });

    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 });
    }

    return NextResponse.json(inspection);
  } catch (error) {
    console.error('Error fetching inspection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { globalStatus, comments } = data;

    const updatedInspection = await prisma.inspection.update({
      where: { id: params.id },
      data: {
        globalStatus,
        comments
      }
    });

    return NextResponse.json(updatedInspection);
  } catch (error) {
    console.error('Error updating inspection:', error);
    return NextResponse.json({ error: 'Failed to update inspection' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.inspection.delete({
      where: { id: params.id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting inspection:', error);
    return NextResponse.json({ error: 'Failed to delete inspection' }, { status: 500 });
  }
}
