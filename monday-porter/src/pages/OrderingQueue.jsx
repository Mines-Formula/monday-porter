import { useState, useEffect } from 'react'
import { Table } from '@chakra-ui/react'

function OrderingQueue() {
    const [items, setItems] = useState(null);
    const [colNames, setColNames] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const monday = window.mondaySdk();
        const itemsTmp = [];
        const cursor = "";

        monday.setToken(import.meta.env.VITE_API_TOKEN);
        monday.api('query { account { id } }', {apiVersion: '2026-01'});
        monday.api('query { boards(ids: 18401063757) { name columns { title id } items_page(limit: 50) { cursor items { id name column_values { text value __typename } } } } }')
        .then(res => {
            console.log(res);
            setItems(res.data.boards[0].items_page.items);
            const cols = res.data.boards[0].columns;
            const names = {};
            for (let i = 1; i < cols.length; i++) {
                //stores column name to index in subsystems
                names[cols[i].title] = i-1;
            }
            console.log(names);
            setColNames(names);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <>
            <h1 class="title">Ordering queue</h1>
            <p>Loading...</p>
            </>
        );
    } else {
        return (
            <>
            <h1 class="title">Ordering queue</h1>
            <div class="table">
            <Table.ScrollArea borderWidth="1px" rounded="md" height="500px">
                <Table.Root size="sm" stickyHeader striped>
                    <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Subsystem</Table.ColumnHeader>
                        <Table.ColumnHeader>Vendor</Table.ColumnHeader>
                        <Table.ColumnHeader>Purchase link</Table.ColumnHeader>
                        <Table.ColumnHeader>Quantity</Table.ColumnHeader>
                        <Table.ColumnHeader>Unit cost</Table.ColumnHeader>
                        <Table.ColumnHeader>Total cost</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                        <Table.ColumnHeader>Authorized person who approved order</Table.ColumnHeader>
                        <Table.ColumnHeader>Date ordered</Table.ColumnHeader>
                        <Table.ColumnHeader>Date recieved</Table.ColumnHeader>
                        <Table.ColumnHeader>Index charged to</Table.ColumnHeader>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {items.map((item) => (
                        <Table.Row>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Subsystem"]].text}</Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Vendor"]].text}</Table.Cell>
                            <Table.Cell><a href={item.column_values[colNames['Purchase link']].text} target="_blank" rel="noopener noreferrer">
                                {item.column_values[colNames['Purchase link']].text}
                            </a></Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Quantity"]].text}</Table.Cell>
                            <Table.Cell>${item.column_values[colNames["Unit cost"]].text}</Table.Cell>
                            <Table.Cell>${item.column_values[colNames["Total cost"]].text}</Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Status"]].text}</Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Authorized person who approved order"]].text}</Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Date ordered"]].text}</Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Date received"]].text}</Table.Cell>
                            <Table.Cell>{item.column_values[colNames["Index charged to"]].text}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            <button >Load All</button>
            </div>
            </>
        )
    }
}

export default OrderingQueue;