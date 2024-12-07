import express from 'express'
import { addFunds, deleteFunds, updateFunds, getUserFunds, allFunds, getSpecificFunds } from '../controllers/fund.controller.js'
import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/all', protectRoute, allFunds)

router.get('/', protectRoute, getUserFunds)
router.get('/fund/:fundId', protectRoute, getSpecificFunds)
router.post('/add-funds', protectRoute, addFunds)
router.put('/update-funds/:fundId', protectRoute, updateFunds)
router.delete('/delete-funds/:fundId', protectRoute, deleteFunds)

export default router;
