import {Router} from 'express'

import {
  addAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress
} from '../controllers/address.controller.js'
import { isAuthenticated, protectAdmin, isAuthenticatedOrAdmin } from '../middlewares/auth.middleware.js'
const router = Router()

router.route('/')
  .post(isAuthenticated, addAddress)
  .get(isAuthenticated,getUserAddresses)

router.route('/:addressId')
  .put(isAuthenticated, updateAddress)
  .get(isAuthenticatedOrAdmin, getAddressById)
  .delete(isAuthenticated, deleteAddress)


export default router;