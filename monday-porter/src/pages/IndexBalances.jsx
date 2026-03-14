import { useState, useEffect } from 'react'
import { Table } from '@chakra-ui/react'
import indexList from 'data/IndexBalances.json'

function IndexBalances() {
    const [indexes, setIndexes] = useState(indexList);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /*async function setData() {
            const postRes = await fetch('/api/indexBalances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(indexList)
            }).then(res => {
                console.log(res);
            });
        }
        setData();*/
        async function getData() {
            const res = await fetch('/api/indexBalances');
            const data = await res.json();
            console.log("Setting indexes to data");
            setIndexes(data);
            setLoading(false);
        }
        getData();
    }, []);

    function totalBalance() {
        let total = 0;
        for (const index of indexes) {
            let balance = parseFloat(index.balance.replace(/,/g, ''));
            total += balance;
        }
        total = total.toLocaleString('en-US')
        return total;
    }

    function totalRevenue() {
        let total = 0;
        for (const index of indexes) {
            let revenue = parseFloat(index.balance.replace(/,/g, ''));
            total += revenue;
        }
        total = total.toLocaleString('en-US')
        return total;
    }

    if (loading) {
        return (
            <>
            <h1 class="title">Index Balances</h1>
            <div class="table">
                <p>Loading index balances...</p>
            </div>
            </>
        )
    } else {
        return (
            <>
            <h1 class="title">Index Balances</h1>
            <div class="table">
            <div id="info">
                <p>Total revenue: ${totalRevenue()}</p>
                <p>Total balance: ${totalBalance()}</p>
            </div>
            <Table.ScrollArea borderWidth="1px" rounded="md">
                <Table.Root size="sm" stickyHeader striped>
                    <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>Index</Table.ColumnHeader>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Revenue</Table.ColumnHeader>
                        <Table.ColumnHeader>Spent</Table.ColumnHeader>
                        <Table.ColumnHeader>Balance</Table.ColumnHeader>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {indexes.map((index) =>(
                        <Table.Row>
                            <Table.Cell>{index.index}</Table.Cell>
                            <Table.Cell>{index.name}</Table.Cell>
                            <Table.Cell>${index.revenue}</Table.Cell>
                            <Table.Cell>${index.spent}</Table.Cell>
                            <Table.Cell>${index.balance}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            </div>
            </>
        )
    }
}

export default IndexBalances;