import { Router } from "express";
import { listInventory, listLowStock, restock } from "../controllers/inventoryController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(listInventory));
router.get("/low-stock", asyncHandler(listLowStock));
router.patch("/:id/restock", asyncHandler(restock));

export default router;