import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdModeEdit, MdDelete } from 'react-icons/md'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { format } from 'date-fns'
import { fundsHeaderContent, isValidAmount, toastStyle } from '@/constant'
import { toast } from 'react-toastify'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import TextInput from '@/components/TextInput'
import DatePicker from '@/components/DatePicker'
import { IoMdEye } from 'react-icons/io'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const Funds = () => {
  const [error, setError] = useState(null)
  const [userFunds, setUserFunds] = useState([])
  const [userExpenses, setUserExpenses] = useState([])
  const [formData, setFormData] = useState({
    amount: 0,
    date: null,
  })
  const [expenseFormData, setExpenseFormData] = useState({
    description: '',
    amount: 0,
    date: null,
  })

  const rowPerPage = 5
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowPerPage)

  const maxFundsCount = userFunds.length

  const getFunds = async () => {
    try {
      const response = await axios.get('/api/funds/')
      const data = response.data.funds

      setUserFunds(data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const deleteFunds = async (fundId) => {
    try {
      const response = await axios.delete(`/api/funds/delete-funds/${fundId}`)
      toast.warn(response.data.message, { ...toastStyle })
    } catch (error) {
      console.log(error)
    }
  }

  const updateFunds = async (fundId) => {
    if (!isValidAmount(formData.amount) || parseFloat(formData.amount) <= 0) {
      return setError({ message: 'Please enter a valid amount.' })
    }

    if (!formData.date) {
      return setError({ message: 'Please enter date issued of funds.' })
    }

    try {
      const response = await axios.put(
        `/api/funds/update-funds/${fundId}`,
        formData
      )
      toast.success(response.data.message, { ...toastStyle })
      setError(null)
    } catch (error) {
      console.log(error)
    }
  }

  const getExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses/expense')
      const data = response.data.expenses

      setUserExpenses(data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const updateExpense = async (expenseId) => {
    try {
      if (
        !isValidAmount(expenseFormData.amount) ||
        parseFloat(expenseFormData.amount) <= 0
      ) {
        return setError({ message: 'Please enter a valid amount.' })
      }

      if (!expenseFormData.date) {
        return setError({ message: 'Please enter date issued of funds.' })
      }

      const response = await axios.put(
        `/api/expenses/update/${expenseId}`,
        expenseFormData
      )
      toast.success(response.data.message, { ...toastStyle })
      console.log(expenseFormData)
      setError(null)
    } catch (error) {
      console.log(error.response)
    }
  }

  const deleteExpense = async (expenseId) => {
    try {
      const response = await axios.delete(`/api/expenses/delete/${expenseId}`)
      toast.warn(response.data.message, { ...toastStyle })
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    getFunds()
    getExpenses()
    return () => {}
  }, [getFunds, getExpenses])
  return (
    <section className='w-full h-screen p-5'>
      <article className='space-y-3'>
        <h1 className='text-2xl font-bold bottom-line relative w-fit pb-2'>
          Funds
        </h1>
        <p className='text-sm text-prompt'>
          A complete breakdown of your{' '}
          <strong className='text-white tracking-wide'>Savings</strong> and{' '}
          <strong className='text-white tracking-wide'>Expenses</strong> to help
          you stay on track.
        </p>
      </article>

      <aside className='mt-5 w-full'>
        
        <aside className='w-full mt-5'>
          <table className='w-full'>
            <thead className='w-full bg-[#161717] rounded-lg'>
              <tr>
                {fundsHeaderContent.map((nav) => {
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
            <tbody className='mt-2'>
              {userFunds.slice(startIndex, endIndex).map((funds, index) => {
                const { _id, amount, date } = funds
                return (
                  <tr
                    key={_id}
                    className={`${
                      index % 2 === 0 ? 'bg-white/10' : 'bg-transparent'
                    } p-3 px-10 gap-5 w-full`}
                  >
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      Savings
                    </td>
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      ₱ {parseFloat(amount.$numberDecimal).toFixed(2)}
                    </td>
                    <td className='text-center py-3'>
                      <div className='flex items-center justify-center gap-x-2 text-xl'>
                        <Dialog>
                          <DialogTrigger>
                            <IoMdEye className='text-blue-500' />
                          </DialogTrigger>
                          <DialogContent className='bg-main border-none'>
                            <DialogHeader>
                              <DialogTitle className='text-start pb-2'>
                                Savings
                              </DialogTitle>
                              <aside className='text-start flex flex-col gap-1'>
                                <h1 className='text-xs tracking-wide font-medium'>
                                  ID: {_id}
                                </h1>
                                <h1 className='text-xs tracking-wide font-medium'>
                                  Description: Not Applicable
                                </h1>
                                <h1 className='text-xs tracking-wide font-medium'>
                                  Amount: ₱{' '}
                                  {parseFloat(amount.$numberDecimal).toFixed(2)}
                                </h1>
                                <h1 className='text-xs tracking-wide font-medium'>
                                  Date added: {format(date, 'MMMM d, yyyy')}
                                </h1>
                              </aside>
                              <DialogDescription></DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <Sheet>
                          <SheetTrigger
                            onClick={() =>
                              setFormData({
                                amount: amount.$numberDecimal,
                                date: date,
                              })
                            }
                          >
                            <MdModeEdit className='cursor-pointer text-green-500' />
                          </SheetTrigger>
                          <SheetContent className='bg-main border-none'>
                            <SheetHeader>
                              <SheetTitle className='text-light'>
                                Update Fund Data
                              </SheetTitle>
                              <SheetDescription>
                                Please fill in the details below to update the
                                fund data.
                              </SheetDescription>
                            </SheetHeader>
                            <div className='flex flex-col gap-5 my-10'>
                              {error && (
                                <p className='w-full text-sm text-red-500 text-start'>
                                  {error.message}
                                </p>
                              )}
                              <TextInput
                                title='Amount'
                                type='number'
                                placeholder='Add desired amount.'
                                value={formData.amount}
                                onChange={(event) =>
                                  setFormData({
                                    ...formData,
                                    amount: event.target.value,
                                  })
                                }
                              />
                              <DatePicker
                                title='Date issued'
                                date={formData.date}
                                setDate={(selectedDate) =>
                                  setFormData({
                                    ...formData,
                                    date: selectedDate.toISOString(),
                                  })
                                }
                              />
                            </div>

                            <SheetFooter>
                              <SheetClose asChild>
                                <Button
                                  type='submit'
                                  onClick={(event) => updateFunds(_id)}
                                  className='primary-button px-5'
                                >
                                  Save changes
                                </Button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <MdDelete className='cursor-pointer text-red-500' />
                          </AlertDialogTrigger>
                          <AlertDialogContent className='bg-main border-none'>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your funds and remove from
                                our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className='bg-red-600 border-none'>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteFunds(_id)}
                              >
                                Delete Fund
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {userExpenses
                .slice(startIndex, endIndex)
                .map((expense, index) => {
                  const { _id, description, amount, date } = expense

                  return (
                    <tr
                      key={_id}
                      className={`${
                        index % 2 === 0 ? 'bg-white/10' : 'bg-transparent'
                      } p-3 px-10 gap-5 w-full`}
                    >
                      <td className='text-[9px] text-center py-3 xl:text-sm'>
                        Expenses
                      </td>
                      <td className='text-[9px] text-center py-3 xl:text-sm'>
                        ₱ {parseFloat(amount.$numberDecimal).toFixed(2)}
                      </td>
                      <td className='text-center py-3'>
                        <div className='flex items-center justify-center gap-x-2 text-xl'>
                          <Dialog>
                            <DialogTrigger>
                              <IoMdEye className='text-blue-500' />
                            </DialogTrigger>
                            <DialogContent className='bg-main border-none'>
                              <DialogHeader>
                                <DialogTitle className='text-start pb-2'>
                                  Expense
                                </DialogTitle>
                                <aside className='text-start flex flex-col gap-1'>
                                  <h1 className='text-xs tracking-wide font-medium'>
                                    ID: {_id}
                                  </h1>
                                  <h1 className='text-xs tracking-wide font-medium'>
                                    Description: {description}
                                  </h1>
                                  <h1 className='text-xs tracking-wide font-medium'>
                                    Amount: ₱{' '}
                                    {parseFloat(amount.$numberDecimal).toFixed(
                                      2
                                    )}
                                  </h1>
                                  <h1 className='text-xs tracking-wide font-medium'>
                                    Date added: {format(date, 'MMMM d, yyyy')}
                                  </h1>
                                </aside>
                                <DialogDescription></DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                          <Sheet>
                            <SheetTrigger
                              onClick={() =>
                                setExpenseFormData({
                                  description: description,
                                  amount: amount.$numberDecimal,
                                  date: date,
                                })
                              }
                            >
                              <MdModeEdit className='cursor-pointer text-green-500' />
                            </SheetTrigger>
                            <SheetContent className='bg-main border-none'>
                              <SheetHeader>
                                <SheetTitle className='text-light'>
                                  Update Expense Data
                                </SheetTitle>
                                <SheetDescription>
                                  Please fill in the details below to update the
                                  expense data.
                                </SheetDescription>
                              </SheetHeader>
                              <div className='flex flex-col gap-5 my-10'>
                                {error && (
                                  <p className='w-full text-sm text-red-500 text-start'>
                                    {error.message}
                                  </p>
                                )}
                                <TextInput
                                  title='Description'
                                  type='text'
                                  placeholder='Provide details or a description of how the money was spent.'
                                  value={expenseFormData.description}
                                  onChange={(event) =>
                                    setExpenseFormData({
                                      ...expenseFormData,
                                      description: event.target.value,
                                    })
                                  }
                                />
                                <TextInput
                                  title='Amount'
                                  type='number'
                                  placeholder='Add desired amount.'
                                  value={expenseFormData.amount}
                                  onChange={(event) =>
                                    setExpenseFormData({
                                      ...expenseFormData,
                                      amount: event.target.value,
                                    })
                                  }
                                />
                                <DatePicker
                                  title='Date issued'
                                  date={expenseFormData.date}
                                  setDate={(selectedDate) =>
                                    setExpenseFormData({
                                      ...expenseFormData,
                                      date: selectedDate.toISOString(),
                                    })
                                  }
                                />
                              </div>

                              <SheetFooter>
                                <SheetClose asChild>
                                  <Button
                                    type='submit'
                                    onClick={(event) => updateExpense(_id)}
                                    className='primary-button px-5'
                                  >
                                    Save changes
                                  </Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <MdDelete className='cursor-pointer text-red-500' />
                            </AlertDialogTrigger>
                            <AlertDialogContent className='bg-main border-none'>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your funds and remove from
                                  our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className='bg-red-600 border-none'>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(event) => deleteExpense(_id)}
                                >
                                  Delete Fund
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </aside>

        <div className='mt-5'>
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
                    endIndex >= maxFundsCount
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
      </aside>
    </section>
  )
}

export default Funds
