import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
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
import { FaDownload } from 'react-icons/fa6'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import PulseLoading from '@/components/PulseLoading'
import exportFromJSON from 'export-from-json'

const Funds = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userFunds, setUserFunds] = useState([])
  const [userExpenses, setUserExpenses] = useState([])
  const [showActions, setShowActions] = useState(null)

  const [formData, setFormData] = useState({
    amount: 0,
    date: null,
  })

  const [expenseFormData, setExpenseFormData] = useState({
    description: '',
    amount: 0,
    date: null,
  })

  const mergeFunds = [
    ...userFunds.map((savings) => ({ ...savings, type: 'Savings' })),
    ...userExpenses.map((expenses) => ({ ...expenses, type: 'Expenses' })),
  ].sort((prev, next) => new Date(next.createdAt) - new Date(prev.createdAt))

  const rowPerPage = isDesktop ? 15 : 10
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowPerPage)

  const maxFundsCount = mergeFunds.length

  const getFunds = useCallback(async () => {
    try {
      const response = await axios.get('/api/funds/')
      const data = response.data.funds

      setUserFunds(data)
    } catch (error) {
      console.log(error.response)
    }
  }, [])

  const handleActions = (_id) => {
    setShowActions((prev) => (prev === _id ? null : _id))
  }

  const deleteFunds = async (fundId) => {
    try {
      const response = await axios.delete(`/api/funds/delete-funds/${fundId}`)
      setUserFunds((prev) => prev.filter((fund) => fund._id !== fundId))
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

  const getExpenses = useCallback(async () => {
    try {
      const response = await axios.get('/api/expenses/expense')
      const data = response.data.expenses

      setUserExpenses(data)
    } catch (error) {
      console.log(error.response)
    }
  }, [])

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
      setUserExpenses((prev) =>
        prev.filter((expense) => expense._id !== expenseId)
      )
      toast.warn(response.data.message, { ...toastStyle })
    } catch (error) {
      console.log(error.response)
    }
  }

  const generateCSV = () => {
    const fundsData = [
      ...userFunds.map((fund) => ({
        ID: fund._id,
        Type: 'Savings',
        Amount: parseFloat(fund.amount.$numberDecimal).toFixed(2),
        Description: 'Not Applicable',
        Date: new Date(fund.date).toLocaleDateString(),
      })),
      ...userExpenses.map((expense) => ({
        ID: expense._id,
        Type: 'Expenses',
        Amount: parseFloat(expense.amount.$numberDecimal).toFixed(2),
        Description: expense.description,
        Date: new Date(expense.date).toLocaleDateString(),
      })),
    ]

    const fileName = 'Funds'
    const exportType = exportFromJSON.types.csv
    exportFromJSON({
      data: fundsData,
      fileName,
      exportType,
    })
  }

  useEffect(() => {
    const fetchingData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([getFunds(), getExpenses()])
      } catch (error) {
        console.error('Error in fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchingData()

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
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

      {isLoading ? (
        <PulseLoading />
      ) : (
        <aside className='mt-5 w-full flex flex-col items-start'>
          <button
            onClick={generateCSV}
            className='bg-secondary text-xs rounded-lg p-3 self-end flex items-center gap-x-2 cursor-pointer hover:bg-black/50 duration-200'
          >
            <span>Generate CSV</span>
            <FaDownload />
          </button>
          <aside className='w-full mt-5'>
            <table className='w-full'>
              <thead className='w-full bg-[#161717] rounded-lg'>
                <tr>
                  {fundsHeaderContent.map((nav) => {
                    const { id, name, desktopOnly } = nav
                    return isDesktop ? (
                      <th
                        key={id}
                        className='flex-1 text-center xl:text-sm text-[10px] font-medium tracking-wide py-5'
                      >
                        {name}
                      </th>
                    ) : (
                      !desktopOnly && (
                        <th
                          key={id}
                          className='flex-1 text-center xl:text-sm text-[10px] font-medium tracking-wide py-5'
                        >
                          {name}
                        </th>
                      )
                    )
                  })}
                </tr>
              </thead>
              <tbody className='mt-2'>
                {mergeFunds.slice(startIndex, endIndex).map((funds, index) => {
                  const { _id, type, description, amount, date } = funds
                  return (
                    <React.Fragment key={_id}>
                      <tr
                        className={`${
                          index % 2 === 0 ? 'bg-white/10' : 'bg-transparent'
                        } p-3 px-10 gap-5 w-full cursor-pointer hover:bg-white/20 relative`}
                        onClick={() => handleActions(_id)}
                      >
                        <td className='text-[9px] text-center py-3 xl:text-sm'>
                          {type}
                        </td>
                        <td className='text-[9px] text-center py-3 xl:text-sm'>
                          {description && description.length > 15
                            ? `${
                                isDesktop
                                  ? description.slice(0, 40)
                                  : description.slice(0, 12)
                              }...`
                            : description || 'Not Applicable'}
                        </td>
                        <td
                          className={`text-[9px] text-center py-3 xl:text-sm font-medium ${
                            type === 'Savings'
                              ? 'text-green-400'
                              : 'text-red-500'
                          }`}
                        >
                          ₱ {type === 'Savings' ? '+' : '-'}
                          {parseFloat(amount.$numberDecimal)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </td>
                        <td className='text-[9px] text-center py-3 xl:text-sm relative flex flex-col'>
                          {format(date, 'MM-dd-yyyy')}
                          {!isDesktop && (
                            <div
                              className={`flex items-center justify-center gap-x-1 text-xl bg-main p-2 absolute right-0 -top-5 rounded-lg ${
                                showActions === _id ? 'scale-100' : 'scale-0'
                              } duration-200`}
                            >
                              {type === 'Savings' ? (
                                <React.Fragment>
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
                                            {parseFloat(
                                              amount.$numberDecimal
                                            ).toFixed(2)}
                                          </h1>
                                          <h1 className='text-xs tracking-wide font-medium'>
                                            Date added:{' '}
                                            {format(date, 'MMMM d, yyyy')}
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
                                          Please fill in the details below to
                                          update the fund data.
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
                                            onClick={(event) =>
                                              updateFunds(_id)
                                            }
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
                                          This action cannot be undone. This
                                          will permanently delete your funds and
                                          remove from our servers.
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
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
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
                                            {parseFloat(
                                              amount.$numberDecimal
                                            ).toFixed(2)}
                                          </h1>
                                          <h1 className='text-xs tracking-wide font-medium'>
                                            Date added:{' '}
                                            {format(date, 'MMMM d, yyyy')}
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
                                          Please fill in the details below to
                                          update the expense data.
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
                                            onClick={(event) =>
                                              updateExpense(_id)
                                            }
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
                                          This action cannot be undone. This
                                          will permanently delete your funds and
                                          remove from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className='bg-red-600 border-none'>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={(event) =>
                                            deleteExpense(_id)
                                          }
                                        >
                                          Delete Fund
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </React.Fragment>
                              )}
                            </div>
                          )}
                        </td>
                        {isDesktop && (
                          <td>
                            {type === 'Savings' ? (
                              <div className='flex items-center justify-center gap-x-2'>
                                <Dialog>
                                  <DialogTrigger>
                                    <IoMdEye className='text-blue-500 text-2xl' />
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
                                          {parseFloat(
                                            amount.$numberDecimal
                                          ).toFixed(2)}
                                        </h1>
                                        <h1 className='text-xs tracking-wide font-medium'>
                                          Date added:{' '}
                                          {format(date, 'MMMM d, yyyy')}
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
                                    <MdModeEdit className='cursor-pointer text-green-500 text-2xl' />
                                  </SheetTrigger>
                                  <SheetContent className='bg-main border-none'>
                                    <SheetHeader>
                                      <SheetTitle className='text-light'>
                                        Update Fund Data
                                      </SheetTitle>
                                      <SheetDescription>
                                        Please fill in the details below to
                                        update the fund data.
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
                                    <MdDelete className='cursor-pointer text-red-500 text-2xl' />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className='bg-main border-none'>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your funds and remove
                                        from our servers.
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
                            ) : (
                              <div className='flex items-center justify-center gap-x-2'>
                                <Dialog>
                                  <DialogTrigger>
                                    <IoMdEye className='text-blue-500 text-2xl' />
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
                                          {parseFloat(
                                            amount.$numberDecimal
                                          ).toFixed(2)}
                                        </h1>
                                        <h1 className='text-xs tracking-wide font-medium'>
                                          Date added:{' '}
                                          {format(date, 'MMMM d, yyyy')}
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
                                    <MdModeEdit className='cursor-pointer text-green-500 text-2xl' />
                                  </SheetTrigger>
                                  <SheetContent className='bg-main border-none'>
                                    <SheetHeader>
                                      <SheetTitle className='text-light'>
                                        Update Expense Data
                                      </SheetTitle>
                                      <SheetDescription>
                                        Please fill in the details below to
                                        update the expense data.
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
                                          onClick={(event) =>
                                            updateExpense(_id)
                                          }
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
                                    <MdDelete className='cursor-pointer text-red-500 text-2xl' />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className='bg-main border-none'>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your funds and remove
                                        from our servers.
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
                            )}
                          </td>
                        )}
                      </tr>
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </aside>
          {/* Pagination Section */}
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
      )}
    </section>
  )
}

export default Funds
