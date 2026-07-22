# ADR 0001: Recipe as a Separate Join Table

**Status:** Accepted

## Context
Menu items consume multiple ingredients in varying quantities. Needed to model the link between MenuItem and InventoryItem.

## Decision
A separate `Recipe` model, with `menuItemId`, `inventoryItemId`, and `quantityRequired`, rather than a field directly on `MenuItem`.

## Reasoning
This is inherently a many-to-many relationship with data attached to the relationship itself (the quantity). A join table is the only correct way to model this — it's what makes automated stock-sufficiency checks possible at all.