import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import userRoute from './routes/user.route.js'
import fundsRoute from './routes/fund.route.js'
import expenseRoute from './routes/expense.route.js'
import transactionRoute from './routes/transaction.route.js'
import { notFound, errorHandler } from './middlewares/errorMiddlware.js'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

dotenv.config()
connectDB()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/api', (request, response) => {
  response.status(200).send('Server is running now!')
})

app.use('/api/users', userRoute)
app.use('/api/funds', fundsRoute)
app.use('/api/expenses', expenseRoute)
app.use('/api/transaction', transactionRoute)

app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})
