import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clean the database
  await prisma.flowEvent.deleteMany()
  await prisma.flow.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.material.deleteMany()
  await prisma.category.deleteMany()
  await prisma.location.deleteMany()
  await prisma.site.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@matflow.com',
      role: 'ADMIN',
    },
  })

  const operator = await prisma.user.create({
    data: {
      name: 'Operator Jean',
      email: 'jean.operator@matflow.com',
      role: 'OPERATOR',
    },
  })

  // 2. Create Site and Locations
  const siteMain = await prisma.site.create({
    data: {
      name: 'Hub Logistique Principal',
      locations: {
        create: [
          { name: 'Quai de Réception', zone: 'A' },
          { name: 'Rayon Matières Premières', zone: 'B' },
          { name: 'Zone de Quarantaine', zone: 'C' },
        ],
      },
    },
    include: { locations: true }
  })

  const locReception = siteMain.locations.find(l => l.name === 'Quai de Réception')
  const locStock = siteMain.locations.find(l => l.name === 'Rayon Matières Premières')

  // 3. Create Categories
  const catRaw = await prisma.category.create({
    data: { name: 'Matière Première' }
  })
  const catPack = await prisma.category.create({
    data: { name: 'Emballage' }
  })

  // 4. Create Materials
  const matMetal = await prisma.material.create({
    data: {
      sku: 'RAW-MTL-001',
      name: 'Acier Inoxydable 304L (Bobines)',
      description: 'Bobines d\'acier pour la production de pièces structurelles',
      categoryId: catRaw.id,
    }
  })

  const matCarton = await prisma.material.create({
    data: {
      sku: 'PKG-BOX-100',
      name: 'Boîte de conditionnement standard types A',
      categoryId: catPack.id,
    }
  })

  // 5. Create Inventory
  await prisma.inventory.create({
    data: {
      materialId: matMetal.id,
      locationId: locStock!.id,
      quantity: 50.5,
      batchNumber: 'LOT-2026-03-A'
    }
  })

  // 6. Create a Demo Flow
  const demoFlow = await prisma.flow.create({
    data: {
      materialId: matMetal.id,
      sourceLocationId: locReception!.id,
      destLocationId: locStock!.id,
      quantity: 10,
      status: 'COMPLETED'
    }
  })

  await prisma.flowEvent.create({
    data: {
      flowId: demoFlow.id,
      status: 'COMPLETED',
      userId: operator.id,
      notes: 'Déchargement et transfert terminés sans incident.'
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
