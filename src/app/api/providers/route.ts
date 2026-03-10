import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const providers = await prisma.scrapProvider.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(providers);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newProvider = await prisma.scrapProvider.create({
      data: {
        name: data.name,
        contact: data.contact
      }
    });

    return NextResponse.json(newProvider, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
