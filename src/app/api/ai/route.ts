import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cet endpoint est destiné aux agents AI (FRONT, BACK, SEC, etc.)
// pour interroger la base de données MatFlow via le backend Next.js.
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, queryParams } = body;

        // TODO: Ajouter une vérification de token d'API (Bearer) pour sécuriser l'accès aux agents AI uniquement.

        switch (action) {
            case "get_inventory_summary":
                const inventory = await prisma.inventory.findMany({
                    include: { material: true, location: true }
                });
                return NextResponse.json({ success: true, data: inventory });

            case "get_recent_flows":
                const flows = await prisma.flow.findMany({
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: { material: true }
                });
                return NextResponse.json({ success: true, data: flows });

            case "get_urgent_controls":
                // Mock for now, this would query components that need regulatory checks
                return NextResponse.json({ success: true, data: { urgentCount: 3, items: [] } });

            default:
                return NextResponse.json(
                    { success: false, error: "Action non reconnue par l'API AI." },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("AI API Error:", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur lors du traitement de la requête AI." },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
