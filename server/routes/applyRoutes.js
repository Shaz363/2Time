import express from "express";
import {
  applyJob,
  getAllApplicants,
  getJobsApplied,
} from "../controllers/applyController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id", userAuth, applyJob);
router.get("/:id?", userAuth, getJobsApplied);
router.get("/all/:id", userAuth, getAllApplicants);

export default router;
