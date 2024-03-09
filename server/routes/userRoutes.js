import express from "express";
import {
  getCompanies,
  getCompanyById,
  getCompanyJobListing,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET user
router.post("/get-user", userAuth, getUser);
router.post("/get-company-joblisting", userAuth, getCompanyJobListing);

router.get("/", getCompanies);
router.get("/get-company/:id", getCompanyById);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

export default router;
