import express from 'express'
import {
  authenticateUser,
  checkUser,
  deleteUser,
  getAllUsers,
  logoutUser,
  registerUser,
  requestAccount,
} from '../controllers/user.controller.js'
import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllUsers)

router.post('/request', requestAccount)
router.post('/login', authenticateUser)
router.post('/register', registerUser)
router.post('/logout', protectRoute, logoutUser)
router.get('/check', checkUser)

router.delete('/delete/:id', protectRoute, deleteUser)

export default router
