import asyncHandler from 'express-async-handler'
import Fund from '../models/fund.model.js'
import Transaction from '../models/transaction.model.js'

const allFunds = asyncHandler(async (request, response) => {
  const funds = await Fund.find({}).populate({
    path: 'userId',
    select: 'name',
  })

  response.status(200).json({ message: 'List of Funds', funds: funds })
})

const getUserFunds = asyncHandler(async (request, response) => {
  const userFunds = await Fund.find({ userId: request.user._id }).populate({
    path: 'userId',
    select: 'name',
  })

  response.status(200).json({ message: 'List of Funds', funds: userFunds })
})

const getSpecificFunds = asyncHandler(async (request, response) => {
  const { fundId } = request.params

  const foundFund = await Fund.findById(fundId)

  if (!foundFund) {
    return response.status(400).json({ message: 'Fund does not exists.' })
  }

  return response.status(200).json({ message: 'Funds', fund: foundFund })
})

const addFunds = asyncHandler(async (request, response) => {
  const userId = request.user._id

  const { date, amount } = request.body

  if (!userId) {
    return response.status(400).json({ message: 'User not found.' })
  }

  if (!date) {
    return response.status(400).json({ message: 'Please provide date issued.' })
  }

  if (!amount) {
    return response.status(400).json({ message: 'Please add desired amount.' })
  }

  const newFunds = await Fund.create({ userId, date, amount })

  const newTransaction = await Transaction.create({
    userId,
    transactionType: 'Fund',
    transactionId: newFunds._id,
    action: 'Add',
  })

  response.status(200).json({
    message: 'Funds added successfully.',
    fund: newFunds,
    transaction: newTransaction,
  })
})

const updateFunds = asyncHandler(async (request, response) => {
  const { fundId } = request.params
  const { amount, date } = request.body

  const updatingFund = await Fund.findById(fundId)

  if (!updatingFund) {
    return response.status(400).json({ message: 'Fund does not exists.' })
  }

  if (!updatingFund.userId.equals(request.user._id)) {
    return response.status(400).json({
      message: 'You dont have access to delete others funds.',
    })
  }

  const updatedFund = await Fund.findByIdAndUpdate(
    fundId,
    { amount, date },
    { new: true }
  )

  const newTransaction = await Transaction.create({
    userId: request.user._id,
    transactionType: 'Fund',
    transactionId: fundId,
    action: 'Modified',
  })

  response.status(200).json({
    message: 'Funds updated successfully.',
    updatedFund: updatedFund,
    transaction: newTransaction,
  })
})

const deleteFunds = asyncHandler(async (request, response) => {
  const { fundId } = request.params

  const deletingFund = await Fund.findById(fundId)

  if (!deletingFund) {
    return response.status(400).json({ message: 'Fund does not exists.' })
  }

  if (!deletingFund.userId.equals(request.user._id)) {
    return response
      .status(400)
      .json({ message: 'You dont have access to delete others funds.' })
  }

  await Fund.findByIdAndDelete(fundId)

  const newTransaction = await Transaction.create({
    userId: request.user._id,
    transactionType: 'Fund',
    transactionId: fundId,
    action: 'Delete',
  })

  response.status(200).json({
    message: 'Funds deleted successfully.',
    fund: deletingFund,
    user: request.user,
    transaction: newTransaction,
  })
})

export {
  allFunds,
  getUserFunds,
  getSpecificFunds,
  addFunds,
  updateFunds,
  deleteFunds,
}
