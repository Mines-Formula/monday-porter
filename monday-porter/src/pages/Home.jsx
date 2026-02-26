import { useEffect, useState } from 'react'
import messages from "data/test.json"

function Home() {
    const [message, setMessage] = useState("idk");

    useEffect(() => {
        setMessage(messages.message);
    }, []);

    return (
        <>
            <h1 text-align="center">Home</h1>
            <main>
                <p>There is nothing here, go to another page</p>
                <p>Message: {message}</p>
            </main>
        </>
    )
}

export default Home;