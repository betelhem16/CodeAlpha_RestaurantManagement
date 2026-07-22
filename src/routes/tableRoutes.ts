import { Router } from "express";
import { listTables, reserveTable } from "../controllers/reservationController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(listTables));
router.post("/reservations", asyncHandler(reserveTable));

export default router;