import mongoose from 'mongoose'

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Expenses = mongoose.model('Expense', ExpenseSchema)

export default Expenses
