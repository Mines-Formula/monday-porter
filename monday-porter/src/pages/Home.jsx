import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import UpdateFromOrderingQueue from '../components/UpdateFromOrderingQueue';

function Home() {
    return (
        <>
            <h1 text-align="center">Home</h1>
            <main>
                <Link to="/authorization" target="_blank">Authorize</Link>
                <UpdateFromOrderingQueue/>
            </main>
        </>
    )
}

export default Home;