import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import { createOrder, updateOrderStatus } from "../services/orderService";

export async function placeOrder(req: Request, res: Response) {
  const { tableId, items } = req.body;
  const order = await createOrder(tableId, items);
  res.status(201).json(order);
}

export async function getOrder(req: Request, res: Response) {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { menuItem: true } } },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.status(200).json(order);
}

export async function patchOrderStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { status } = req.body;
  const order = await updateOrderStatus(id, status);
  res.status(200).json(order);
}