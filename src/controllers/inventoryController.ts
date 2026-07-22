import { Request, Response } from "express";
import { getAllInventory, getLowStockItems, restockItem } from "../services/inventoryService";

export async function listInventory(req: Request, res: Response) {
  res.status(200).json(await getAllInventory());
}

export async function listLowStock(req: Request, res: Response) {
  res.status(200).json(await getLowStockItems());
}

export async function restock(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { amount } = req.body;
  const item = await restockItem(id, amount);
  res.status(200).json(item);
}