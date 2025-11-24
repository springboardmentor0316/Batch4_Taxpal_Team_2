// routes/taxEstimatorRoutes.js (ESM)
import express from "express";
import * as taxCtrl from "../controllers/taxestimatorcontroller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/calc", auth(false), taxCtrl.calc);   // optional
router.post("/save", auth(true), taxCtrl.save);    // requires auth
router.get("/", auth(false), taxCtrl.list);        // optional
router.put("/:id", auth(true), taxCtrl.update);    // requires auth


export default router;
