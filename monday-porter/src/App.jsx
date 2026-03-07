import { Routes, Route, Link } from 'react-router-dom'
import 'src/App.css'
import Home from 'pages/Home.jsx'
import SubsystemBudgets from 'pages/SubsystemBudgets.jsx'
import OrderingQueue from 'pages/OrderingQueue.jsx'
import Spending from 'pages/Spending.jsx'

function App() {
  return (
    <>
      <nav class="fixed">
        <Link to="/">Home</Link> | {" "}
        <Link to="/subsystemBudgets">Subsystem Budgets</Link> | {" "}
        <Link to="/orderingQueue">Ordering Queue</Link> | {" "}
        <Link to="/spending">Spending</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subsystemBudgets" element={<SubsystemBudgets />} />
        <Route path="/orderingQueue" element={<OrderingQueue/>} />
        <Route path="/spending" element={<Spending/>} />
      </Routes>
    </>
  )
}

export default App