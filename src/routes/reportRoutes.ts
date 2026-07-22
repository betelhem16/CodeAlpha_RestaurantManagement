import { Router } from "express";
import { dailySales } from "../controllers/reportController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/daily-sales", asyncHandler(dailySales));

export default router;