import { Router } from "express";
import { placeOrder, getOrder, patchOrderStatus } from "../controllers/orderController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/", asyncHandler(placeOrder));
router.get("/:id", asyncHandler(getOrder));
router.patch("/:id/status", asyncHandler(patchOrderStatus));

export default router;