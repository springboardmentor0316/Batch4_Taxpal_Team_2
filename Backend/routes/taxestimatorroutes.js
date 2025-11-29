// routes/taxestimatorroutes.js
import express from "express";
import * as taxCtrl from "../controllers/taxestimatorcontroller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// public calc (optional auth) — allow unauthenticated calculation
router.post("/calc", auth(false), taxCtrl.calc);

// Save: require auth to save user's records
// Accept POST /api/tax  -> save (requires auth)
router.post("/", auth(true), taxCtrl.save);

// Keep /save as alias but require auth as well (compatibility)
router.post("/save", auth(true), taxCtrl.save);

// history (requires auth) - returns user's saved records
router.get("/history", auth(true), taxCtrl.list);

// update existing record (requires auth)
router.put("/:id", auth(true), taxCtrl.update);

// delete record (requires auth)
router.delete("/:id", auth(true), taxCtrl.remove);

export default router;
