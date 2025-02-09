import { Router } from "express";
import { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture, 
  toggleWishlist,
  getWishlistProducts 
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Protect all user routes
router.use(isAuthenticated);

router.route("/profile")
  .get(getUserProfile)     // Get user profile
  .patch(updateUserProfile); // Update user details

router.route('/wishlist/:productId').put(toggleWishlist);

router.route('/wishlist').get(getWishlistProducts)

router.route("/profile-picture")
  .patch(upload.single("image"), updateProfilePicture); // Change profile picture

export default router;
