import express from 'express'
import { addTransaction, getTransaction } from '../controllers/transaction.controller.js'

import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protectRoute, getTransaction)
router.post('/add', protectRoute, addTransaction)

export default router
