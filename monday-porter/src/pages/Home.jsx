import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import UpdateFromOrderingQueue from '../components/UpdateFromOrderingQueue';

function Home() {
    useEffect(() => {
        async function getData() {
            const res = await fetch('/api/userID');
            console.log(res);
            const data = await res.json();
            console.log(data)
        }
        getData();
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