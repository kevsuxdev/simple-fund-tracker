import mongoose from 'mongoose'

const FundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
  },
  { timestamps: true }
)

const Fund = mongoose.model('Fund', FundSchema)

export default Fund
