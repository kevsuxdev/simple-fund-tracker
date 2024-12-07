import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import AddFunds from './pages/Dashboard/AddFunds.jsx'
import Transaction from './pages/Dashboard/Transaction.jsx'
import Funds from './pages/Dashboard/Funds.jsx'
import Expenses from './pages/Dashboard/Expenses.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' Component={App} />
        <Route path='/login' Component={Login} />
        <Route path='/dashboard' Component={DashboardLayout}>
          <Route index Component={Dashboard} />
          <Route path='funds' Component={Funds} />
          <Route path='add-funds' Component={AddFunds} />
          <Route path='add-expenses' Component={Expenses} />
          <Route path='transaction' Component={Transaction} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
)
