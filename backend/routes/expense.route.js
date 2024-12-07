import express from 'express'
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../controllers/expense.controller.js'
import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/expense', protectRoute, getExpenses)
router.post('/add-expenses', protectRoute, addExpense)
router.put('/update/:expenseId', protectRoute, updateExpense)
router.delete('/delete/:expenseId', protectRoute, deleteExpense)

export default router
