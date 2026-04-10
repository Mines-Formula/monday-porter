import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import UpdateFromOrderingQueue from '../components/UpdateFromOrderingQueue';

function Home() {
    useEffect(() => {
        async function getInfo() {
            const res = await fetch('/api/orderingQueue');
            console.log(res);
            const data = await res.json();
            console.log(data);
        }
        getInfo();
    }, []);

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