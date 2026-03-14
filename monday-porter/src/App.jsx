import { Routes, Route, Link } from 'react-router-dom'
import 'src/App.css'
import Home from 'pages/Home.jsx'
import SubsystemBudgets from 'pages/SubsystemBudgets.jsx'
import Vendors from 'pages/Vendors.jsx'
import IndexBalances from 'pages/IndexBalances.jsx'

function App() {
  return (
    <>
      <nav class="fixed">
        <Link to="/">Home</Link> | {" "}
        <Link to="/subsystemBudgets">Subsystem Budgets</Link> | {" "}
        <Link to="/vendors">Approved Vendors</Link> | {" "}
        <Link to="/indexBalances">Index Balances</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subsystemBudgets" element={<SubsystemBudgets />} />
        <Route path="/vendors" element={<Vendors/>} />
        <Route path="/indexBalances" element={<IndexBalances/>} />
      </Routes>
    </>
  )
}

export default App