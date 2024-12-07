import asyncHandler from 'express-async-handler'
import Expenses from '../models/expense.model.js'
import Transaction from '../models/transaction.model.js'

const getExpenses = asyncHandler(async (request, response) => {
  const userId = request.user._id

  if (!userId) return response.status(400).json({ message: 'User not found.' })

  const userExpenses = await Expenses.find({ userId })

  return response
    .status(200)
    .json({ message: 'List of expenses', expenses: userExpenses })
})

const addExpense = asyncHandler(async (request, response) => {
  const userId = request.user._id

  const { amount, date, description } = request.body

  if (!userId) {
    return response.status(400).json({ message: 'User not found.' })
  }

  if (!date) {
    return response.status(400).json({ message: 'Please provide date issued.' })
  }

  if (!amount) {
    return response.status(400).json({ message: 'Please add desired amount.' })
  }

  if (!description) {
    return response.status(400).json({
      message: 'Please enter a description of how the money was spent.',
    })
  }

  const newExpense = await Expenses.create({
    userId,
    date,
    amount,
    description,
  })

  const newTransaction = await Transaction.create({
    userId,
    transactionType: 'Expense',
    transactionId: newExpense._id,
    action: 'Add',
  })

  return response.status(200).json({
    message: 'Expense added successully.',
    expense: newExpense,
    transaction: newTransaction,
  })
})

const updateExpense = asyncHandler(async (request, response) => {
  const { expenseId } = request.params
  const { description, amount, date } = request.body
  const userId = request.user._id

  const updatingExpense = await Expenses.findById(expenseId)

  if (!updatingExpense) {
    return response.status(400).json({ message: 'Expense does not exists.' })
  }

  if (!updatingExpense.userId.equals(request.user._id)) {
    return response.status(400).json({
      message: 'You dont have access to delete others funds.',
    })
  }

  await Expenses.findByIdAndUpdate(
    expenseId,
    {
      description,
      amount,
      date,
    },
    { new: true }
  )

  const newTransaction = await Transaction.create({
    userId,
    transactionType: 'Expense',
    transactionId: expenseId,
    action: 'Modified',
  })

  return response.status(200).json({
    message: 'Expense updated successfully.',
    transaction: newTransaction,
  })
})

const deleteExpense = asyncHandler(async (request, response) => {
  const { expenseId } = request.params
  const userId = request.user._id

  const foundExpense = await Expenses.findById(expenseId)

  if (!foundExpense) {
    return response.status(404).json({ message: 'Expense not found.' })
  }

  if (!foundExpense.userId.equals(userId)) {
    return response.status(401).json({
      message: 'You do not have a permission to delete others expenses.',
    })
  }

  await Expenses.findByIdAndDelete(expenseId)

  const newTransaction = await Transaction.create({
    userId,
    transactionType: 'Expense',
    transactionId: expenseId,
    action: 'Delete',
  })

  return response.status(200).json({
    message: 'Expense deleted successfully.',
    expense: foundExpense,
    transaction: newTransaction,
  })
})

export { getExpenses, addExpense, updateExpense, deleteExpense }
