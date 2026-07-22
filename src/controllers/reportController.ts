import { Request, Response } from "express";
import prisma from "../models/prismaClient";

export async function dailySales(req: Request, res: Response) {
  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID" },
    include: { items: true },
  });

  const totalsByDate: Record<string, number> = {};
  for (const order of paidOrders) {
    const date = order.createdAt.toISOString().split("T")[0];
    const orderTotal = order.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);
    totalsByDate[date] = (totalsByDate[date] || 0) + orderTotal;
  }

  res.status(200).json(totalsByDate);
}