import { beforeEach, afterAll } from "vitest";
import prisma from "./models/prismaClient";

beforeEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.table.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});