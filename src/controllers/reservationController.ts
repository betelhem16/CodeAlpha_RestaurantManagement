import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import { createReservation } from "../services/reservationService";

export async function listTables(req: Request, res: Response) {
  res.status(200).json(await prisma.table.findMany());
}

export async function reserveTable(req: Request, res: Response) {
  const { tableId, customerName, reservedFor } = req.body;
  const reservation = await createReservation(tableId, customerName, new Date(reservedFor));
  res.status(201).json(reservation);
}