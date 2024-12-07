import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protectRoute = asyncHandler(async (request, response, next) => {
  const token = request.cookies.token

  if (!token) return response.status(404).json({ message: 'No token found.' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    request.user = await User.findById(decoded.userId).select('-password')

    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return response.status(401).json({
      message: 'Not authorized, token failed.',
    })
  }
})
export { protectRoute }
