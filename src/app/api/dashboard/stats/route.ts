import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Réceptions en attente
    const pendingReceptions = await prisma.reception.count({
      where: { status: 'PENDING' }
    });

    // 2. Contrôles en attente
    const pendingInspections = await prisma.inspection.count({
      where: { globalStatus: 'PENDING' }
    });

    // 3. Réformes complétées (ou en attente)
    const pendingReforms = await prisma.reformRequest.count({
      where: { status: 'PENDING' }
    });
    
    const approvedReforms = await prisma.reformRequest.count({
      where: { status: 'APPROVED' }
    });

    // 4. Ferraillage (Lots prêts pour collecte / en attente)
    const pendingScrapBatches = await prisma.scrapBatch.count({
      where: { status: 'PENDING' }
    });

    // 5. Inventaire global (Total des quantités en stock)
    const inventoryResult = await prisma.inventory.aggregate({
      _sum: { quantity: true }
    });
    const totalInventory = inventoryResult._sum.quantity || 0;

    // 6. Capitalisation (nouveaux matériels ajoutés récemment - count simple)
    const totalMaterials = await prisma.material.count();

    return NextResponse.json({
      receptions: {
        pending: pendingReceptions
      },
      inspections: {
        pending: pendingInspections
      },
      reforms: {
        pending: pendingReforms,
        approved: approvedReforms
      },
      scrap: {
        pending: pendingScrapBatches
      },
      inventory: {
        totalItems: totalInventory
      },
      materials: {
        total: totalMaterials
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
