import { useState, useEffect } from 'react'
import { Table } from '@chakra-ui/react'
import subsystemList from 'data/subsystemBudgets.json'
import ChangeSubsystemBudgets from '../components/ChangeSubsystemBudgets';

function SubsystemBudgets() {
    const [subsystems, setSubsystems] = useState(subsystemList);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /*async function setData() {
            const postRes = await fetch('/api/subsystemBudgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subsystemList)
            }).then(res => {
                console.log(res);
            });
        }
        setData();*/
        async function getData() {
            const res = await fetch('/api/subsystemBudgets');
            const data = await res.json();
            console.log("Setting subsystems to data");
            setSubsystems(data);
            setLoading(false);
        }
        getData();
    }, []);

    function colorCode(percentRemaining) {
        if (percentRemaining >= 66) return 'green';
        if (percentRemaining >= 33) return 'orange';
        else return 'red';
    }

    if (loading) {
        return (
            <>
            <h1 class="title">Subsystem Budgets</h1>
            <div class="table">
                <p>Loading subsystem budgets...</p>
            </div>
            </>
        )
    } else {
        return (
            <>
            <h1 class="title">Subsystem Budgets</h1>
            <div class="table">
            <Table.ScrollArea borderWidth="1px" rounded="md">
                <Table.Root size="sm" stickyHeader striped>
                    <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>Subsystem</Table.ColumnHeader>
                        <Table.ColumnHeader>Budget</Table.ColumnHeader>
                        <Table.ColumnHeader>Spent</Table.ColumnHeader>
                        <Table.ColumnHeader>Remaining</Table.ColumnHeader>
                        <Table.ColumnHeader>% Remaining</Table.ColumnHeader>
                        <Table.ColumnHeader>Budget Notes</Table.ColumnHeader>
                    </Table.Row>
                    </Table.Header>
    
                    <Table.Body>
                    {subsystems.map((subsystem) =>(
                        <Table.Row>
                            <Table.Cell>{subsystem.subsystem}</Table.Cell>
                            <Table.Cell>${subsystem.budget}</Table.Cell>
                            <Table.Cell>${subsystem.spent}</Table.Cell>
                            <Table.Cell>${subsystem.remaining}</Table.Cell>
                            <Table.Cell style={{color: colorCode(subsystem.percentRemaining)}}>{subsystem.percentRemaining}%</Table.Cell>
                            <Table.Cell>{subsystem.budgetNotes}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            </div>
            <ChangeSubsystemBudgets subsystemBudgetsInput={subsystems} setSubsystemBudgets={setSubsystems}></ChangeSubsystemBudgets>
            </>
        )
    }
}

export default SubsystemBudgets;