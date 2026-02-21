import { useState, useEffect } from 'react'
import { Accordion, Span, Stack, Text } from '@chakra-ui/react'

function SubsystemBudgets() {
    const [subsystems, setSubsystems] = useState(null);
    const [colNames, setColNames] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const monday = window.mondaySdk();

        monday.setToken(import.meta.env.VITE_API_TOKEN);
        monday.api('query { account { id } }', {apiVersion: '2026-01'});
        monday.api('query { boards(ids: 18401057070) { name columns { title id } items_page { items { id name column_values { text value __typename } } } } }')
        .then(res => {
            console.log(res);
            setSubsystems(res.data.boards[0].items_page.items);
            const cols = res.data.boards[0].columns;
            const names = {};
            for (let i = 1; i < cols.length; i++) {
                //stores column name to index in subsystems
                names[cols[i].title] = i-1;
            }
            setColNames(names);
            setLoading(false);
        });
    }, []);


    if (loading) {
        return (
            <>
            <h1 class="title fixed">Subsystem Budgets</h1>
            <main>
                <p>Loading...</p>
            </main>
            </>
        );
    } else {
        return (
            <>
            <h1 class="title fixed">Subsystem Budgets</h1>
            <main>
            <Stack gap="4">
                <Accordion.Root>
                    {subsystems.map((subsystem, index) => (
                    <Accordion.Item key={index} value={index}>
                        <Accordion.ItemTrigger>
                        <Span flex="1">{subsystem.name}</Span>
                        <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            <p>Allocated budget: ${subsystem.column_values[colNames["Budget"]].text}</p>
                            <p>Amount of budget spent: ${subsystem.column_values[colNames["Spent"]].text}</p>
                            <p>Amount of budget remaining: ${subsystem.column_values[colNames["Remaining"]].text}</p>
                            <p>Percent of budget remaining: {subsystem.column_values[colNames["% Remaining"]].text}%</p>
                            <p>Notes: {subsystem.column_values[colNames["Budget Notes"]].text}</p>
                        </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Stack>
            </main>
            </>
        );
    }
}

export default SubsystemBudgets;