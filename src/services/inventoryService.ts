import prisma from "../models/prismaClient";

export async function getAllInventory() {
  return await prisma.inventoryItem.findMany();
}

export async function getLowStockItems() {
  const items = await prisma.inventoryItem.findMany();
  return items.filter((item) => item.quantityInStock <= item.lowStockThreshold);
}

export async function restockItem(id: number, amount: number) {
  if (amount <= 0) {
    throw new Error("Restock amount must be greater than zero");
  }

  return await prisma.inventoryItem.update({
    where: { id },
    data: { quantityInStock: { increment: amount } },
  });
}