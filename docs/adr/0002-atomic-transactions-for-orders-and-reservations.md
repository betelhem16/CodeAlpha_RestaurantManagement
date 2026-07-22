# ADR 0002: Atomic Transactions for Concurrency-Sensitive Operations

**Status:** Accepted

## Context
Two operations are vulnerable to race conditions under concurrent use: reserving a table, and decrementing inventory when placing an order.

## Decision
- Table reservations use `updateMany` with the expected status in the `where` clause, wrapped in `$transaction`.
- Order creation wraps the entire order — every ingredient check and decrement across every item — in a single `$transaction`.

## Reasoning
Read-then-write logic in application code cannot guarantee correctness under concurrent requests; two requests can both pass a check before either writes. Pushing the conditional check into the database's atomic update guarantees only one request can win. Wrapping the full order in a transaction ensures partial failures (one ingredient out of stock) roll back everything, rather than leaving a corrupted partial order.

## Consequences
Verified with automated tests simulating simultaneous requests (`Promise.allSettled`), not just sequential happy-path tests.