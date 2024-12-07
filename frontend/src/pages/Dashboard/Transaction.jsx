import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

const Transaction = () => {
  const [userTransaction, setUserTranscation] = useState([])

  const getTransaction = async () => {
    try {
      const response = await axios.get('/api/transaction')
      setUserTranscation(response.data.transaction)
    } catch (error) {
      console.log(error.response)
    }
  }

  const rowPerPage = 8
  const maxTransaction = userTransaction.length
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowPerPage)
  
  useEffect(() => {
    getTransaction()
  }, [getTransaction])

  return (
    <section className='w-full h-screen p-5'>
      <h1 className='text-2xl font-bold bottom-line relative w-fit pb-2'>
        Transaction History
      </h1>

      <div>
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

      <aside className='mt-10 flex flex-col gap-5 xl:px-5 px-5 pb-20 '>
        {userTransaction
          .slice(startIndex, endIndex)
          .map((transaction, index) => {
            const { _id, transactionType, transactionId, action, createdAt } =
              transaction
            return (
              <article
                className='xl:flex xl:items-start gap-5 border-b border-b-gray-600 pb-5 last:border-b-0 grid'
                key={_id}
              >
                <div className='flex-1'>
                  <h3 className='text-xs text-slate-300 font-semibold tracking-wide'>
                    Transaction ID
                  </h3>
                  <p className='text-sm font-medium'>{_id}</p>
                </div>

                <div className='flex-1'>
                  <h3 className='text-xs text-slate-300 font-semibold tracking-wide'>
                    Transaction Type
                  </h3>
                  <p className='text-sm font-medium'>
                    {transactionType === 'Fund' ? 'Savings' : 'Expenses'}
                  </p>
                </div>

                <div className='flex-1'>
                  <h3 className='text-xs text-slate-300 font-semibold tracking-wide'>
                    Amount
                  </h3>
                  <p className='text-sm font-medium'>
                    {transactionId
                      ? `₱ ${parseFloat(
                          transactionId.amount.$numberDecimal
                        ).toFixed(2)}`
                      : 'Deleted'}
                  </p>
                </div>

                <div className='flex-1'>
                  <h3 className='text-xs text-slate-300 font-semibold tracking-wide'>
                    Action
                  </h3>
                  <p className='text-sm font-medium'>{action}</p>
                </div>

                <div className='flex-1'>
                  <h3 className='text-xs text-slate-300 font-semibold tracking-wide'>
                    Date Issued
                  </h3>
                  <p className='text-sm font-medium'>
                    {format(createdAt, 'MMM dd, yyyy')}
                  </p>
                </div>
              </article>
            )
          })}
      </aside>
    </section>
  )
}

export default Transaction
