import { useEffect } from 'react'
import {
 SeamlessApiClient, ApiClient
} from "@mondaydotcomorg/api";

function Home() {
    useEffect(() => {
        async function getInfo() {
            const res = await fetch('/api/orderingQueue');
            const data = await res.json();
            console.log(data);
        }
        getInfo();
    }, []);

    return (
        <>
            <h1 text-align="center">Home</h1>
            <main>
                <p>There is nothing here, go to another page</p>
            </main>
        </>
    )
}

export default Home;