// routes/taxEstimatorRoutes.js
import express from "express";
import * as taxCtrl from "../controllers/taxestimatorcontroller.js";
import auth from "../middleware/auth.js"; // your auth middleware

const router = express.Router();

// public calc (optional auth)
router.post("/calc", auth(false), taxCtrl.calc);

// save (requires auth)
router.post("/save", auth(true), taxCtrl.save);

// history (requires auth) - returns user's saved records
router.get("/history", auth(true), taxCtrl.list);

// update existing record (requires auth)
router.put("/:id", auth(true), taxCtrl.update);

//delete record 
router.delete("/:id", auth(true), taxCtrl.remove);


export default router;
