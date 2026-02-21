import { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import 'src/App.css'
import Home from 'pages/Home.jsx'
import SubsystemBudgets from 'pages/SubsystemBudgets.jsx'

function App() {

  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/subsystemBudgets">Subsystem Budgets</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subsystemBudgets" element={<SubsystemBudgets />} />
      </Routes>
    </>
  )
}

export default App