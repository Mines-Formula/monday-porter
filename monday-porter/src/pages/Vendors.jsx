import { useState } from 'react'
import vendorList from 'data/vendors.json'
import { Table } from '@chakra-ui/react'

function Vendors() {
    const [vendors, setVendors] = useState(vendorList);

    return (
        <>
        <h1 class="title">Approved Vendors</h1>
        <div class="table">
        <Table.ScrollArea borderWidth="1px" rounded="md" height="500px">
            <Table.Root size="sm" stickyHeader striped>
                <Table.Header>
                <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Spending</Table.ColumnHeader>
                    <Table.ColumnHeader>Preference</Table.ColumnHeader>
                    <Table.ColumnHeader>Notes</Table.ColumnHeader>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                {vendors.map((vendor) =>(
                    <Table.Row>
                        <Table.Cell>{vendor.name}</Table.Cell>
                        <Table.Cell>{vendor.spending}</Table.Cell>
                        <Table.Cell>{vendor.preference}</Table.Cell>
                        <Table.Cell>{vendor.notes}</Table.Cell>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
        </div>
        </>
    )
}

export default Vendors;