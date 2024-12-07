import { IoIosHome } from 'react-icons/io'
import { GiMoneyStack } from 'react-icons/gi'
import { GiTakeMyMoney } from 'react-icons/gi'
import { AiOutlineTransaction } from 'react-icons/ai'
import { MdMoneyOff } from 'react-icons/md'

const navLinks = [
  { id: 2, location: 'funds', name: 'Funds', icon: <GiMoneyStack /> },
  { id: 3, location: 'add-funds', name: 'Add Funds', icon: <GiTakeMyMoney /> },
  {
    id: 4,
    location: 'add-expenses',
    name: 'Add Expenses',
    icon: <MdMoneyOff />,
  },
  {
    id: 5,
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
  { id: 1, name: 'Transaction Type' },
  { id: 2, name: 'Description' },
  { id: 3, name: 'Amount' },
  { id: 4, name: 'Date Issued' },
  { id: 5, name: 'Action' },
]

export { navLinks, isValidAmount, toastStyle, fundsHeaderContent }
