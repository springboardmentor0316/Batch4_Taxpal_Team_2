// routes/taxCalendarRoutes.js (ESM)
import express from "express";
import * as ctrl from "../controllers/taxcalendarcontroller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, ctrl.getPayment);
router.put("/:quarter", auth, ctrl.markQuarterPaid);

export default router;
