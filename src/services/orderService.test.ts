import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../models/prismaClient";
import { createOrder } from "./orderService";

let tableId: number;
let menuItemId: number;
let flourId: number;

beforeEach(async () => {
  const table = await prisma.table.create({
    data: { tableNumber: 1, capacity: 4, status: "AVAILABLE" },
  });
  tableId = table.id;

  const flour = await prisma.inventoryItem.create({
    data: { name: "Flour", quantityInStock: 1000, unit: "g", lowStockThreshold: 100 },
  });
  flourId = flour.id;

  const pizza = await prisma.menuItem.create({
    data: { name: "Pizza", price: 10, isAvailable: true },
  });
  menuItemId = pizza.id;

  await prisma.recipe.create({
    data: { menuItemId: pizza.id, inventoryItemId: flour.id, quantityRequired: 200 },
  });
});

describe("createOrder", () => {
  it("decrements inventory correctly on success", async () => {
    await createOrder(tableId, [{ menuItemId, quantity: 2 }]);

    const flour = await prisma.inventoryItem.findUnique({ where: { id: flourId } });
    expect(flour?.quantityInStock).toBe(600); // 1000 - (200 * 2)
  });

  it("rejects and rolls back completely when stock is insufficient", async () => {
    await expect(
      createOrder(tableId, [{ menuItemId, quantity: 100 }]) // needs 20,000g, only 1000g exists
    ).rejects.toThrow("Insufficient stock");

    const flour = await prisma.inventoryItem.findUnique({ where: { id: flourId } });
    expect(flour?.quantityInStock).toBe(1000); // untouched, proving atomicity
  });

  it("rejects an order with zero quantity", async () => {
    await expect(
      createOrder(tableId, [{ menuItemId, quantity: 0 }])
    ).rejects.toThrow("quantity must be greater than zero");
  });

  it("rejects an order with no items", async () => {
    await expect(createOrder(tableId, [])).rejects.toThrow("at least one item");
  });
});