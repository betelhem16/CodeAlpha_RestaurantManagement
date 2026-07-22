import prisma from "../models/prismaClient";

interface OrderItemInput {
  menuItemId: number;
  quantity: number;
}

export async function createOrder(tableId: number, items: OrderItemInput[]) {
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }
  for (const item of items) {
    if (item.quantity <= 0) {
      throw new Error("Item quantity must be greater than zero");
    }
  }

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: { tableId, status: "PENDING" },
    });

    for (const item of items) {
      const menuItem = await tx.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem || !menuItem.isAvailable) {
        throw new Error(`Menu item ${item.menuItemId} is not available`);
      }

      const recipeLines = await tx.recipe.findMany({ where: { menuItemId: item.menuItemId } });

      for (const line of recipeLines) {
        const needed = line.quantityRequired * item.quantity;
        const result = await tx.inventoryItem.updateMany({
          where: { id: line.inventoryItemId, quantityInStock: { gte: needed } },
          data: { quantityInStock: { decrement: needed } },
        });
        if (result.count === 0) {
          throw new Error(`Insufficient stock to fulfill ${menuItem.name}`);
        }
      }

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceAtOrder: menuItem.price,
        },
      });
    }

    return await tx.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { menuItem: true } } },
    });
  });
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["PREPARING", "CANCELLED"],
  PREPARING: ["SERVED", "CANCELLED"],
  SERVED: ["PAID"],
  PAID: [],
  CANCELLED: [],
};

export async function updateOrderStatus(orderId: number, newStatus: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error("Order not found");
  }

  const allowed = ALLOWED_TRANSITIONS[order.status];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Cannot transition order from ${order.status} to ${newStatus}`);
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as any },
  });
}