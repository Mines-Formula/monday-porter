import { useState, useEffect } from 'react'
import vendorList from 'data/vendors.json'
import { Table } from '@chakra-ui/react'
import AddVendors from 'components/AddVendors.jsx'

function Vendors() {
    const [vendors, setVendors] = useState(vendorList);
    const [loading, setLoading] = useState(true);

    function colorCode(preference) {
        if (preference == "Preferred") return 'green';
        if (preference == "Acceptable") return 'blue';
        if (preference == "Nightmare") return 'red';
        else return 'black';
    }

    useEffect(() => {
        /*async function setData() {
            const postRes = await fetch('/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vendorList)
            }).then(res => {
                console.log(res);
            });
        }
        setData();*/
        async function getData() {
            const res = await fetch('/api/vendors');
            const data = await res.json();
            console.log("Setting vendors to data");
            setVendors(data);
            setLoading(false);
        }
        getData();
    }, []);

    if (loading) {
        return (
            <>
            <h1 class="title">Approved Vendors</h1>
            <div class="table">
                <p>Loading vendors...</p>
            </div>
            </>
        )
    } else {
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
                            <Table.Cell>${vendor.spending}</Table.Cell>
                            <Table.Cell style={{color: colorCode(vendor.preference)}}>{vendor.preference}</Table.Cell>
                            <Table.Cell>{vendor.notes}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            </div>
            <AddVendors vendors={vendors} setVendors={setVendors}></AddVendors>
            </>
        )
    }
}

export default Vendors;