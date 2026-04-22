import { Routes, Route, Link } from 'react-router-dom'
import 'src/App.css'
import Home from 'pages/Home.jsx'
import BudgetEvents from 'pages/BudgetEvents.jsx'
import Vendors from 'pages/Vendors.jsx'
import BudgetsAndRevenue from './pages/BudgetsAndRevenue'

function App() {
  return (
    <>
      <nav class="fixed">
        <Link to="/">Home</Link> | {" "}
        <Link to="/budgetsRevenue">Budgets and Revenue</Link> | {" "}
        <Link to="/budgetEvents">Budget Events</Link> | {" "}
        <Link to="/vendors">Approved Vendors</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budgetsRevenue" element={<BudgetsAndRevenue/>}/>
        <Route path="/vendors" element={<Vendors/>} />
        <Route path="/budgetEvents" element={<BudgetEvents/>} />
      </Routes>
    </>
  )
}

export default App