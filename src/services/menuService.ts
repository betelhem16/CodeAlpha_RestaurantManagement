import prisma from "../models/prismaClient";

export async function getAllMenuItems() {
  return await prisma.menuItem.findMany({
    where: { isAvailable: true },
  });
}

export async function createMenuItem(name: string, price: number) {
  if (!name || name.trim().length === 0) {
    throw new Error("Menu item name is required");
  }
  if (price <= 0) {
    throw new Error("Price must be greater than zero");
  }

  return await prisma.menuItem.create({
    data: { name: name.trim(), price },
  });
}

export async function updateMenuItem(
  id: number,
  data: { name?: string; price?: number; isAvailable?: boolean }
) {
  if (data.price !== undefined && data.price <= 0) {
    throw new Error("Price must be greater than zero");
  }

  return await prisma.menuItem.update({
    where: { id },
    data,
  });
}