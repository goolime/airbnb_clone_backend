import express from 'express'
import { getUser, updateUser, deleteUser, addToWishlist, removeFromWishlist } from './user.controller.js'
import { getOrdersByUserId } from '../order/orders.controller.js'
import { log } from '../../midlewares/log.middleware.js'
import { requireAuth } from '../../midlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/:userId', log, getUser)
router.get('/:userId/orders', log, requireAuth, getOrdersByUserId)
router.put('/:userId', log, requireAuth, updateUser)
router.delete('/:userId', log, requireAuth, deleteUser)
// whishlit
router.post('/:userId/wishlist/:propertyId', log, requireAuth, addToWishlist)
router.delete('/:userId/wishlist/:propertyId', log, requireAuth, removeFromWishlist)

const userRoutes = router
export default userRoutes