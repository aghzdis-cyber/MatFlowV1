import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 1. Total Équipements (Somme des quantités en inventaire)
        const inventories = await prisma.inventory.findMany({
            include: { location: true }
        });

        const totalEquipment = inventories.reduce((sum, inv) => sum + inv.quantity, 0);

        // 2. Zones actives
        const activeZonesCount = new Set(inventories.map(inv => inv.locationId)).size;

        // 3. Répartition par zone (pour le graphique BarChart)
        const zoneMap = new Map<string, number>();
        inventories.forEach(inv => {
            const zoneName = inv.location?.name || "Inconnu";
            zoneMap.set(zoneName, (zoneMap.get(zoneName) || 0) + inv.quantity);
        });
        const zoneData = Array.from(zoneMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5 zones

        // 4. Flux récents pour le statut
        const recentFlows = await prisma.flow.findMany({
            where: {
                status: { in: ['IN_TRANSIT', 'COMPLETED', 'PENDING'] }
            }
        });

        const pendingCount = recentFlows.filter(f => f.status === 'PENDING').length;
        const inTransitCount = recentFlows.filter(f => f.status === 'IN_TRANSIT').length;
        const completedCount = recentFlows.filter(f => f.status === 'COMPLETED').length;

        const statusData = [
            { name: "Complétés", value: completedCount || 1, color: "#10b981" }, // Emerald
            { name: "En Transit", value: inTransitCount || 1, color: "#3b82f6" }, // Blue
            { name: "En Attente", value: pendingCount || 1, color: "#f59e0b" }, // Amber
        ];

        // Mocks for now until regulatory controls are implemented
        const controlsData = [
            { month: "Jan", controls: 5 },
            { month: "Fév", controls: 8 },
            { month: "Mar", controls: 12 },
            { month: "Avr", controls: 7 },
            { month: "Mai", controls: 15 },
            { month: "Juin", controls: 10 },
        ];

        return NextResponse.json({
            totalEquipment,
            activeZonesCount,
            zoneData,
            statusData,
            controlsData,
            urgentControls: 3 // Mocked value
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
