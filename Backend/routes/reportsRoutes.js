import express from "express";
import * as ctrl from "../controllers/reportsController.js";
import auth from "../middleware/auth.js"; // default factory from your middleware

const router = express.Router();

// generate: requires auth
router.post("/generate", auth(true), ctrl.generateReport);
// list: requires auth
router.get("/", auth(true), ctrl.listReports);
// get single
router.get("/:id", auth(true), ctrl.getReport);
// download
router.get("/:id/download", auth(true), ctrl.downloadReport);
// delete
router.delete("/:id", auth(true), ctrl.deleteReport);

export default router;
