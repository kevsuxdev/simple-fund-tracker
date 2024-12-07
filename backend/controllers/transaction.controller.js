import asyncHandler from 'express-async-handler'
import Transaction from '../models/transaction.model.js'

const getTransaction = asyncHandler(async (request, response) => {
  const userId = request.user._id

  if (!userId) {
    return response.status(404).json({ message: 'User not found.' })
  }

  const transactions = await Transaction.find({ userId })

  const populateTransaction = await Promise.all(
    transactions.map(async (transaction) => {
      return await transaction.populateTransaction()
    })
  )

  return response.status(200).json({
    message: 'Transaction retrieved successfully',
    transaction: populateTransaction,
  })
})

const addTransaction = asyncHandler(async (request, response) => {
  const userId = request.user._id
  const { transactionType, transactionId, action } = request.body

  if (!userId) {
    return response.status(404).json({ message: 'User not found.' })
  }

  if (!transactionType) {
    return response
      .status(400)
      .json({ message: 'Please select transaction type.' })
  }

  if (!transactionId) {
    return response.status(400).json({ message: 'Please select transaction.' })
  }

  if (!action) {
    return response.status(400).json({ message: 'Please add action.' })
  }

  const newTransaction = await Transaction.create({
    userId,
    transactionType,
    transactionId,
    action,
  })

  return response.status(200).json({
    message: 'Transaction added successfully.',
    transaction: newTransaction,
  })
})

export { getTransaction, addTransaction }
