import { Request, Response } from "express";
import { getAllMenuItems, createMenuItem, updateMenuItem } from "../services/menuService";

export async function listMenu(req: Request, res: Response) {
  const items = await getAllMenuItems();
  res.status(200).json(items);
}

export async function addMenuItem(req: Request, res: Response) {
  const { name, price } = req.body;
  const item = await createMenuItem(name, price);
  res.status(201).json(item);
}

export async function patchMenuItem(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await updateMenuItem(id, req.body);
  res.status(200).json(item);
}