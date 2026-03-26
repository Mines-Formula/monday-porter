import { Routes, Route, Link } from 'react-router-dom'
import 'src/App.css'
import Home from 'pages/Home.jsx'
import SubsystemBudgets from 'pages/SubsystemBudgets.jsx'
import OrderingQueue from 'pages/OrderingQueue.jsx'
import Spending from 'pages/Spending.jsx'
import TeamBudget from 'pages/TeamBudget.jsx'
import BudgetChange from 'pages/BudgetChange.jsx'
import Vendors from 'pages/Vendors.jsx'
import IndexBalances from 'pages/IndexBalances.jsx'
import RevenueChanges from 'pages/RevenueChanges.jsx'

function App() {
  return (
    <>
      <nav class="fixed">
        <Link to="/">Home</Link> | {" "}
        <Link to="/subsystemBudgets">Subsystem Budgets</Link> | {" "}
        <Link to="/orderingQueue">Ordering Queue</Link> | {" "}
        <Link to="/spending">Spending</Link> | {" "}
        <Link to="/teamBudget">Team Budget</Link> | {" "}
        <Link to="/budgetChange">Budget Change</Link> | {" "}
        <Link to="/vendors">Approved Vendors</Link> | {" "}
        <Link to="/indexBalances">Index Balances</Link> | {" "}
        <Link to="/revenueEvents">Revenue Events</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subsystemBudgets" element={<SubsystemBudgets />} />
        <Route path="/orderingQueue" element={<OrderingQueue/>} />
        <Route path="/spending" element={<Spending/>} />
        <Route path="/teamBudget" element={<TeamBudget/>} />
        <Route path="/budgetChange" element={<BudgetChange/>} />
        <Route path="/vendors" element={<Vendors/>} />
        <Route path="/indexBalances" element={<IndexBalances/>} />
        <Route path="/revenueEvents" element={<RevenueChanges/>} />
      </Routes>
    </>
  )
}

export default App