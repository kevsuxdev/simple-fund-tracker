import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { transactionHeaderContent } from '@/constant'

const Transaction = () => {
  const [userTransaction, setUserTranscation] = useState([])
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  const getTransaction = useCallback(async () => {
    try {
      const response = await axios.get('/api/transaction')
      const data = await response.data.transaction

      const latestTransaction = data.sort(
        (prev, next) => new Date(next.createdAt) - new Date(prev.createdAt)
      )

      setUserTranscation(latestTransaction)
    } catch (error) {
      console.log(error.response)
    }
  }, [])

  const rowPerPage = isDesktop ? 15 : 10
  const maxTransaction = userTransaction.length
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowPerPage)

  useEffect(() => {
    getTransaction()
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [getTransaction])

  return (
    <section className='w-full h-screen p-5'>
      <h1 className='text-2xl font-bold bottom-line relative w-fit pb-2'>
        Transaction History
      </h1>

      <div className='my-5'>
        <Pagination className='w-fit'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  startIndex === 0
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
                onClick={() => {
                  setStartIndex(startIndex - rowPerPage)
                  setEndIndex(endIndex - rowPerPage)
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={
                  endIndex >= maxTransaction
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
                onClick={() => {
                  setStartIndex(startIndex + rowPerPage)
                  setEndIndex(endIndex + rowPerPage)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <aside>
        <table className='w-full border-collapse'>
          <thead className='w-full bg-[#161717] rounded-lg'>
            <tr>
              {transactionHeaderContent.map((nav) => {
                const { id, name } = nav
                return (
                  <th
                    key={id}
                    className='flex-1 text-center xl:text-sm text-[10px] font-medium tracking-wide py-5'
                  >
                    {name}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className='w-full'>
            {userTransaction
              .slice(startIndex, endIndex)
              .map((transaction, index) => {
                const {
                  _id,
                  transactionType,
                  transactionId,
                  action,
                  createdAt,
                } = transaction
                return (
                  <tr
                    key={_id}
                    className={`${
                      index % 2 === 0 ? 'bg-white/10' : 'bg-transparent'
                    } p-3 px-10 gap-5 w-full rounded-lg`}
                  >
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      {transactionType === 'Fund' ? 'Savings' : 'Expenses'}
                    </td>
                    <td
                      className={`text-[9px] text-center py-3 xl:text-sm font-medium 
                        ${
                          transactionId
                            ? transactionType === 'Fund'
                              ? 'text-green-400'
                              : transactionType === 'Expense'
                              ? 'text-red-500'
                              : ''
                            : ''
                        }`}
                    >
                      {transactionId
                        ? `₱ ${
                            transactionType === 'Fund' ? '+' : '-'
                          }${parseFloat(transactionId.amount.$numberDecimal)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g)}`
                        : 'Deleted'}
                    </td>
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      {action}
                    </td>
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      {format(createdAt, 'MM-dd-yyyy')}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </aside>
    </section>
  )
}

export default Transaction
