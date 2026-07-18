import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Tables — upsert by tableNumber (our natural unique identifier)
  const tableData = [
    { tableNumber: 1, capacity: 2 },
    { tableNumber: 2, capacity: 4 },
    { tableNumber: 3, capacity: 6 },
  ];
  for (const t of tableData) {
    await prisma.table.upsert({
      where: { tableNumber: t.tableNumber },
      update: {},
      create: { ...t, status: "AVAILABLE" },
    });
  }

  // Inventory — upsert by name
  const flour = await prisma.inventoryItem.upsert({
    where: { name: "Flour" },
    update: {},
    create: { name: "Flour", quantityInStock: 5000, unit: "g", lowStockThreshold: 500 },
  });
  const cheese = await prisma.inventoryItem.upsert({
    where: { name: "Mozzarella" },
    update: {},
    create: { name: "Mozzarella", quantityInStock: 3000, unit: "g", lowStockThreshold: 300 },
  });
  const tomatoSauce = await prisma.inventoryItem.upsert({
    where: { name: "Tomato Sauce" },
    update: {},
    create: { name: "Tomato Sauce", quantityInStock: 2000, unit: "g", lowStockThreshold: 200 },
  });

  // Menu item — upsert by name
  const pizza = await prisma.menuItem.upsert({
    where: { name: "Margherita Pizza" },
    update: {},
    create: { name: "Margherita Pizza", price: 12.99 },
  });

  // Recipe — upsert by the composite unique key we already defined in the schema
  const recipeLinks = [
    { inventoryItemId: flour.id, quantityRequired: 200 },
    { inventoryItemId: cheese.id, quantityRequired: 150 },
    { inventoryItemId: tomatoSauce.id, quantityRequired: 100 },
  ];
  for (const r of recipeLinks) {
    await prisma.recipe.upsert({
      where: {
        menuItemId_inventoryItemId: { menuItemId: pizza.id, inventoryItemId: r.inventoryItemId },
      },
      update: { quantityRequired: r.quantityRequired },
      create: { menuItemId: pizza.id, ...r },
    });
  }

  console.log("Seed data is up to date.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });