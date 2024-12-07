import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ['Fund', 'Expense']
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

TransactionSchema.methods.populateTransaction = function () {
  return this.populate({
    path: 'transactionId',
    model: this.transactionType,
  })
}

const Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction
