import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from 'recharts'

const MonthyExpense = ({ isDesktop }) => {
  const expensesData = [
    { month: 'January', expense: 0 },
    { month: 'February', expense: 0 },
    { month: 'March', expense: 0 },
    { month: 'April', expense: 0 },
    { month: 'May', expense: 0 },
    { month: 'June', expense: 0 },
    { month: 'July', expense: 0 },
    { month: 'August', expense: 0 },
    { month: 'September', expense: 0 },
    { month: 'October', expense: 0 },
    { month: 'November', expense: 0 },
    { month: 'December', expense: 0 },
  ]

  const [expenses, setExpenses] = useState(expensesData)
  const currentYear = new Date().getFullYear()

  const getExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses/expense')
      const data = response.data.expenses

      const expensesByMonth = data
        .filter((fund) => {
          const fundDate = new Date(fund.date)
          return fundDate.getFullYear() === currentYear
        })
        .reduce((acc, curr) => {
          const date = new Date(curr.date)
          const monthName = date.toLocaleString('default', { month: 'long' })
          const amount = parseFloat(curr.amount.$numberDecimal)

          if (acc[monthName]) {
            acc[monthName] += amount
          } else {
            acc[monthName] = amount
          }

          return acc
        }, {})

      const updatedExpenses = expensesData.map((item) => ({
        ...item,
        expense: expensesByMonth[item.month] || 0,
      }))

      setExpenses(updatedExpenses)
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    getExpenses()
    return () => {}
  }, [getExpenses])
  return (
    <React.Fragment>
      <ResponsiveContainer
        width='100%'
        height='100%'
        className={'flex flex-col gap-2 pb-20'}
      >
        <article className='flex flex-col gap-3'>
          <h1 className='text-2xl font-bold tracking-wide'>Monthy Expenses</h1>
          <p className='text-prompt text-sm'>
            Monitor your expenses every month in {currentYear}.
          </p>
        </article>
        <BarChart
          className={'p-5 bg-secondary rounded-lg'}
          accessibilityLayer
          data={expenses}
          margin={{
            top: 30,
          }}
        >
          <CartesianGrid
            vertical={false}
            horizontal={true}
            strokeDasharray={'3 5'}
            stroke='#e25ccb'
          />

          <XAxis
            dataKey={'month'}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <Bar
            dataKey={'expense'}
            fill='#d60303'
            radius={20}
            width={15}
            barSize={isDesktop ? 120 : 50}
          >
            <LabelList
              dataKey='month'
              position='insideBottom'
              offset={18}
              fontSize={isDesktop ? 12 : 10}
              fill='#ffff'
              fontWeight={500}
              formatter={(value) => (isDesktop ? value : value.slice(0, 3))}
            />
            <LabelList
              dataKey={'expense'}
              fontSize={13}
              position='top'
              fill='#ffff'
              fontWeight={500}
              content={({ x, y, value, width, height }) => {
                const offset = value > 0 ? 10 : 50
                const formattedValue = value.toLocaleString()
                return (
                  <text
                    x={x + width / 2}
                    y={y - offset}
                    fill='#ffff'
                    fontSize={13}
                    fontWeight={500}
                    textAnchor='middle'
                  >
                    {formattedValue}
                  </text>
                )
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}

export default MonthyExpense
