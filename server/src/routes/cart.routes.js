import { Router } from 'express'
import {
  getCart, 
  addToCart, 
  removeFromCart, 
  applyCoupon, 
  clearCart 
} from '../controllers/cart.controller.js'

const router = Router()
import { isAuthenticated } from '../middlewares/auth.middleware.js';
router.use(isAuthenticated)

router.route('/')
  .get(getCart)
  .post(addToCart)
  .put(applyCoupon)
  .delete(clearCart)
  .patch(removeFromCart)



export default router