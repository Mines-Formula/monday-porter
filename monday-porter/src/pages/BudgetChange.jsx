import { useState, useEffect } from 'react'
import budgetChangeList from 'data/budgetChange.json'
import { Stack, Table } from '@chakra-ui/react'
import AddBudgetChange from 'components/AddBudgetChange.jsx'


function BudgetChange() {
    const [budgetChange, setBudgetChange] = useState(budgetChangeList);

    useEffect(() => {
        async function getData() {
            const res = await fetch('/api/budgetChange');
            const data = await res.json();
            console.log("Setting budgetChange to data");
            setBudgetChange(data);
        }
        getData();
    }, []);

    console.log(budgetChange);

    return (
        <>
        <h1 class="title fixed">Budget Change</h1>
        <main>
            <Stack gap="4">
                <Table.Root size="sm" striped>
                    <Table.Header>
                        <Table.Row>
                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Category</Table.ColumnHeader>
                        <Table.ColumnHeader>Before Allocation</Table.ColumnHeader>
                        <Table.ColumnHeader>After Alloctation</Table.ColumnHeader>
                        <Table.ColumnHeader>Explanation</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {budgetChange.map((bc) => (
                        <Table.Row>
                            <Table.Cell>{bc.date}</Table.Cell>
                            <Table.Cell>{bc.category}</Table.Cell>
                            <Table.Cell>${bc.beforeAllocation.toLocaleString('en-US')}</Table.Cell>
                            <Table.Cell>${bc.afterAllocation.toLocaleString('en-US')}</Table.Cell>
                            <Table.Cell>{bc.explanation}</Table.Cell>
                        </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Stack>
        </main>
        <AddBudgetChange budgetChange={budgetChange} setBudgetChange={setBudgetChange}></AddBudgetChange>
        </>
    );
}

export default BudgetChange;