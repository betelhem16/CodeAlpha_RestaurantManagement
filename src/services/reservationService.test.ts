import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../models/prismaClient";
import { createReservation } from "./reservationService";

let tableId: number;

beforeEach(async () => {
  const table = await prisma.table.create({
    data: { tableNumber: 1, capacity: 4, status: "AVAILABLE" },
  });
  tableId = table.id;
});

describe("createReservation", () => {
  it("succeeds when the table is available", async () => {
    const reservation = await createReservation(tableId, "Alice", new Date());
    expect(reservation.customerName).toBe("Alice");

    const table = await prisma.table.findUnique({ where: { id: tableId } });
    expect(table?.status).toBe("RESERVED");
  });

  it("rejects a reservation on an already-reserved table", async () => {
    await createReservation(tableId, "Alice", new Date());

    await expect(
      createReservation(tableId, "Bob", new Date())
    ).rejects.toThrow("not available");
  });

  it("allows only one of two simultaneous reservation attempts to succeed", async () => {
    const results = await Promise.allSettled([
      createReservation(tableId, "Alice", new Date()),
      createReservation(tableId, "Bob", new Date()),
    ]);

    const succeeded = results.filter((r) => r.status === "fulfilled");
    const failed = results.filter((r) => r.status === "rejected");

    expect(succeeded).toHaveLength(1);
    expect(failed).toHaveLength(1);
  });
});