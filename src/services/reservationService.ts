import prisma from "../models/prismaClient";

export async function createReservation(
  tableId: number,
  customerName: string,
  reservedFor: Date
) {
  return await prisma.$transaction(async (tx) => {
    const result = await tx.table.updateMany({
      where: { id: tableId, status: "AVAILABLE" },
      data: { status: "RESERVED" },
    });

    if (result.count === 0) {
      throw new Error("Table is not available for reservation");
    }

    const reservation = await tx.reservation.create({
      data: { tableId, customerName, reservedFor },
    });

    return reservation;
  });
}