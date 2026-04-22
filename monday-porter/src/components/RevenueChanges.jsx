import { useState, useEffect } from 'react'
import revenueChangesList from 'data/RevenueChanges.json'
import { Table } from '@chakra-ui/react'

function RevenueChanges() {
    const [revenue, setRevenue] = useState(revenueChangesList);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /*async function setData() {
            const postRes = await fetch('/api/revenueChanges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(revenueChangesList)
            }).then(res => {
                console.log(res);
            });
        }
        setData();*/
        async function getData() {
            const res = await fetch('/api/revenueChanges');
            const data = await res.json();
            console.log("Setting vendors to data");
            setRevenue(data);
            setLoading(false);
        }
        getData();
    }, []);

    if (loading) {
        return (
            <>
            <h1 class="title">Revenue Events</h1>
            <div class="table">
                <p>Loading revenue events...</p>
            </div>
            </>
        )
    } else {
        return (
            <>
            <h1 class="title">Revenue Events</h1>
            <div class="table">
            <Table.ScrollArea borderWidth="1px" rounded="md">
                <Table.Root size="sm" stickyHeader striped>
                    <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Amount</Table.ColumnHeader>
                        <Table.ColumnHeader>Index</Table.ColumnHeader>
                        <Table.ColumnHeader>Description</Table.ColumnHeader>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {revenue.map((revenue) =>(
                        <Table.Row>
                            <Table.Cell>{revenue.date}</Table.Cell>
                            <Table.Cell>{revenue.amount}</Table.Cell>
                            <Table.Cell>{revenue.index}</Table.Cell>
                            <Table.Cell>{revenue.description}</Table.Cell>
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

export default RevenueChanges;