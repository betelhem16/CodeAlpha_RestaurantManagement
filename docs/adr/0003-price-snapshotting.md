# ADR 0003: Snapshot Price on OrderItem

**Status:** Accepted

## Context
Menu prices can change over time. Historical orders must reflect the price at the time of purchase.

## Decision
`OrderItem.priceAtOrder` stores a copy of the price at order time, rather than referencing `MenuItem.price` live.

## Reasoning
Without snapshotting, a future price change would silently rewrite historical revenue data on every past order.