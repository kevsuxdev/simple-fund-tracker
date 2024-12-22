import { IoIosHome } from 'react-icons/io'
import { GiMoneyStack } from 'react-icons/gi'
import { GiTakeMyMoney } from 'react-icons/gi'
import { AiOutlineTransaction } from 'react-icons/ai'
import { MdMoneyOff } from 'react-icons/md'
import { MdOutlineAttachMoney, MdOutlineMoneyOff } from 'react-icons/md'

const navLinks = [
  { id: 1, location: '', name: 'Dashboard', icon: <IoIosHome /> },
  {
    id: 2,
    location: 'funds',
    name: 'Funds & Expenses',
    icon: <GiMoneyStack />,
    subCategory: [
      {
        id: 1,
        location: 'funds',
        name: 'Manage Funds',
        icon: <GiTakeMyMoney />,
      },
      {
        id: 2,
        location: 'add-funds',
        name: 'Add Funds',
        icon: <MdOutlineAttachMoney />,
      },
      {
        id: 3,
        location: 'add-expenses',
        name: 'Add Expenses',
        icon: <MdOutlineMoneyOff />,
      },
    ],
  },
  {
    id: 3,
    location: 'transaction',
    name: 'Transaction History',
    icon: <AiOutlineTransaction />,
  },
]

const isValidAmount = (amount) => {
  const regex = /^(0|[1-9]\d*)$/
  return regex.test(amount)
}

const toastStyle = {
  theme: 'dark',
  autoClose: 2000,
  position: 'top-right',
  pauseOnHover: false,
  hideProgressBar: true,
  closeOnClick: true,
  style: { color: 'white', fontSize: '13.5px', fontFamily: 'Poppins' },
}
const fundsHeaderContent = [
  { id: 1, name: 'Type', desktopOnly: false },
  { id: 2, name: 'Description', desktopOnly: false },
  { id: 3, name: 'Amount', desktopOnly: false },
  { id: 4, name: 'Date', desktopOnly: false },
  { id: 5, name: 'Action', desktopOnly: true },
]
const savingsHeaderContent = [
  { id: 1, name: 'Type' },
  { id: 2, name: 'Amount' },
  { id: 3, name: 'Date' },
]

const expensesHeaderContent = [
  { id: 1, name: 'Type' },
  { id: 2, name: 'Description' },
  { id: 3, name: 'Amount' },
  { id: 4, name: 'Date' },
]

const transactionHeaderContent = [
  { id: 1, name: 'Type' },
  { id: 2, name: 'Amount' },
  { id: 3, name: 'Action' },
  { id: 4, name: 'Date issued' },
]

const landingNav = [
  { id: 1, name: 'About', location: '/about' },
  { id: 2, name: 'Contact', location: '/contact' },
]

export {
  navLinks,
  isValidAmount,
  toastStyle,
  fundsHeaderContent,
  landingNav,
  savingsHeaderContent,
  expensesHeaderContent,
  transactionHeaderContent
}
