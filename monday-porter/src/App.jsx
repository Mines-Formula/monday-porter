import { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import 'src/App.css'
import Home from 'pages/Home.jsx'
import SubsystemBudgets from 'pages/SubsystemBudgets.jsx'

function App() {
  useEffect(() => {
    const monday = window.mondaySdk();

    monday.setToken(import.meta.env.VITE_API_TOKEN);
    monday.api('query { account { id } }', {apiVersion: '2026-01'});
    monday.api('query { boards { workspace { id name } id name }}')
      .then(res => console.log(res));
  }, []);

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