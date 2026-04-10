import { useState, useEffect } from 'react'
import spendingList from 'data/spending.json'
import { Stack, Table } from '@chakra-ui/react'


function Spending() {
    const [spenders, setSpenders] = useState(spendingList);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        /*async function setData() {
            const postRes = await fetch('/api/spending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(spendingList)
            }).then(res => {
                console.log(res);
            });
        }
        setData();*/
        async function getData() {
            const res = await fetch('/api/spending');
            const data = await res.json();
            console.log("Setting spenders to data");
            setSpenders(data);
            setLoading(false);
        }
        getData();
    }, []);

    if (loading) {
        return (
            <>
            <h1 class="title">Spending</h1>
            <div class="table">
                <p>Loading spending...</p>
            </div>
            </>
        )
    } else {
        return (
            <>
            <h1 class="title fixed">Spending</h1>
            <main>
            <Stack gap="4">
                <Table.Root size="sm" striped>
                    <Table.Header>
                        <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Authorized Amount</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Spending</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {spenders.map((spender) => (
                        <Table.Row key={spender.name}>
                            <Table.Cell>{spender.name}</Table.Cell>
                            <Table.Cell>{spender.authorizedAmount}</Table.Cell>
                            <Table.Cell textAlign="end">{spender.spending}</Table.Cell>
                        </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Stack>
            </main>
            </>
        );
    }
}


export default Spending;