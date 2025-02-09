import {Router} from 'express'
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
} from '../controllers/order.controller.js'
const router = Router()
import { isAuthenticated, protectAdmin, isAuthenticatedOrAdmin } from '../middlewares/auth.middleware.js'

router.route('/')
  .post(isAuthenticated ,createOrder)
  .get(protectAdmin, getAllOrders)
  
  
  
router.route('/:idorderId')
  .get(isAuthenticated, getOrderById)
  .put(isAuthenticated, cancelOrder)

router.route('/user-order')
  .get(isAuthenticated, getUserOrders)

export default router;