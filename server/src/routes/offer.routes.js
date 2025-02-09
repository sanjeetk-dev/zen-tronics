import express from "express";
import {
  createOffer,
  updateOffer,
  deleteOffer,
  getOffers
} from "../controllers/offer.controller.js";
import { isAuthenticated, protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
import {upload} from '../middlewares/multer.middleware.js'

// Create a new offer (Admin only)
router.route("/")
  .get(getOffers)
  .post(protectAdmin, upload.array('images', 3),createOffer)
  
router.route('/:id')
  .put(updateOffer)
  .delete(deleteOffer)


export default router;
