import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  LabelList,
} from 'recharts'

const MonthlyTrack = () => {
  const savingsData = [
    { month: 'January', saving: 0 },
    { month: 'February', saving: 0 },
    { month: 'March', saving: 0 },
    { month: 'April', saving: 0 },
    { month: 'May', saving: 0 },
    { month: 'June', saving: 0 },
    { month: 'July', saving: 0 },
    { month: 'August', saving: 0 },
    { month: 'September', saving: 0 },
    { month: 'October', saving: 0 },
    { month: 'November', saving: 0 },
    { month: 'December', saving: 0 },
  ]

  const [savings, setSavings] = useState(savingsData)
  const currentYear = new Date().getFullYear()

  const getSavings = async () => {
    try {
      const response = await axios.get('/api/funds/')
      const data = response.data.funds

      const savingsByMonth = data
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

      const updatedSavings = savingsData.map((item) => ({
        ...item,
        saving: savingsByMonth[item.month] || 0,
      }))

      setSavings(updatedSavings)
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    getSavings()
  }, [])

  return (
    <React.Fragment>
      <ResponsiveContainer
        width='100%'
        height='50%'
        className={'mt-5 flex flex-col gap-2'}
      >
        <article className='flex flex-col gap-1'>
          <h1 className='text-xl font-bold tracking-wide'>Monthy Savings</h1>
          <p className='text-prompt text-xs'>
            Monitor your savings month by month.
          </p>
        </article>
        <BarChart
          className={'p-5 bg-secondary rounded-lg outline-none'}
          accessibilityLayer
          data={savings}
          margin={{
            top: 30,
          }}
        >
          <CartesianGrid vertical={false} horizontal={true} />
          <XAxis
            dataKey={'month'}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <Bar
            dataKey={'saving'}
            fill='#00d43b'
            radius={5}
            width={15}
            barSize={50}
          >
            <LabelList
              dataKey='month'
              position='insideBottom'
              horizontal
              offset={8}
              fontSize={10}
              fill='#101110'
              fontWeight={500}
              formatter={(value) => value.slice(0, 3)}
            />
            <LabelList
              dataKey={'saving'}
              fontSize={10}
              position='top'
              fill='#ffff'
              fontWeight={500}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}

export default MonthlyTrack
