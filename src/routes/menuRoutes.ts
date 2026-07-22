import { Router } from "express";
import { listMenu, addMenuItem, patchMenuItem } from "../controllers/menuController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(listMenu));
router.post("/", asyncHandler(addMenuItem));
router.patch("/:id", asyncHandler(patchMenuItem));

export default router;