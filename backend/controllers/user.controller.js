import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { isEmail } from '../utils/regex.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'


const getAllUsers = asyncHandler(async (request, response) => {
  const users = await User.find()
  response.status(201).json(users)
})

const authenticateUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body

  if (!isEmail(email)) {
    return response
      .status(400)
      .json({ message: 'Please enter a valid email address.' })
  }

  if (!password) {
    return response.status(400).json({ message: 'Please enter your password.' })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return response.status(400).json({ message: 'User does not exists.' })
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password)

  if (!isPasswordMatch) {
    return response
      .status(400)
      .json({ message: 'Login failed. Please check your email and password.' })
  }

  const token = generateToken(response, user._id)

  response.status(200).json({
    message: 'Logged in successfully.',
    userId: user._id,
    token: token,
  })
})

const registerUser = asyncHandler(async (request, response) => {
  const { name, email, password, confirmPassword } = request.body

  if (!name) {
    return response.status(400).json({ message: 'Please enter your name.' })
  }

  if (!isEmail(email)) {
    return response
      .status(400)
      .json({ message: 'Please enter a valid email address.' })
  }

  if (password.length < 8) {
    return response
      .status(400)
      .json({ message: 'Password must be at least 8 characters.' })
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ message: 'Password must be match.' })
  }

  const isEmailExist = await User.findOne({ email })

  if (isEmailExist) {
    return response
      .status(400)
      .json({ message: 'Email address is already exists.' })
  }

  const hashPassword = bcrypt.hashSync(password, 10)

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  })

  return response
    .status(200)
    .json({ message: 'User registered successfully.', user: newUser })
})

const deleteUser = asyncHandler(async (request, response) => {
  const userId = request.params.id

  const user = await User.findById(userId)

  if (!user) {
    return response.status(400).json({ message: 'User not found.' })
  }

  if (!request.user._id.equals(user._id)) {
    return response
      .status(401)
      .json({ message: 'You dont have a permission to delete others account.' })
  }

  await User.findByIdAndDelete(userId)

  return response.status(200).json({ message: 'User deleted successfully.' })
})

const logoutUser = asyncHandler(async (request, response) => {
  response.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0,
  })

  return response.status(200).json({ message: 'Logged out user.' })
})

const checkUser = asyncHandler(async (request, response) => {
  const token = request.cookies.token

  if (!token) {
    return response.status(401).json({ message: 'No session found.' })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    response.status(200).json({ message: 'Session is valid.' })
  } catch (error) {
    return response.status(401).json({ message: 'Session expired or invalid.' })
  }
})

export {
  getAllUsers,
  authenticateUser,
  registerUser,
  deleteUser,
  logoutUser,
  checkUser,
}
