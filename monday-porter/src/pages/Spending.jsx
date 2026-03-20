import { useState, useEffect } from 'react'
import data from 'data/spending.json'
import { Stack, Table } from '@chakra-ui/react'


function Spending() {
    const [spenders, setSpenders] = useState([]);

    useEffect(() => { 
        setSpenders(data);
    }, []);

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


export default Spending;