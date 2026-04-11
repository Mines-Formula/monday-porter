import { useState, useEffect } from 'react'
import teamBudgetList from 'data/teamBudget.json'
import { DataList, Flex, Box } from '@chakra-ui/react'


function TeamBudget() {
    const [teamBudget, setTeamBudget] = useState(teamBudgetList);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        /*async function setData() {
            const postRes = await fetch('/api/teamBudget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamBudgetList)
            }).then(res => {
                console.log(res);
            });
        }
        setData();*/
        async function getData() {
            const res = await fetch('/api/teamBudget');
            const data = await res.json();
            console.log("Setting team budget to data");
            setTeamBudget(data);
            setLoading(false);
        }
        getData();
    }, []);

    console.log(teamBudget);
    if (loading) {
        return (
            <>
            <h1 class="title">Team Budget</h1>
            <div class="table">
                <p>Loading team budget...</p>
            </div>
            </>
        )
    } else {
        return (
            <>
            <h1 class="title fixed">Team Budget</h1>
            <main>
                <Flex gap="10">
                {teamBudget.map((section) => (
                    <Box borderWidth={2} padding={2}>
                        <DataList.Root key={section.section_name}>
                                <DataList.ItemLabel>{section.section_name}</DataList.ItemLabel>
                                {(section.items).map((item) => (
                                    <DataList.Item key={item.name}>
                                        <DataList.ItemLabel>{item.name}</DataList.ItemLabel>
                                        <DataList.ItemValue>${item.value.toLocaleString('en-US')}</DataList.ItemValue>
                                    </DataList.Item>
                                ))}
                        </DataList.Root>
                    </Box>
                ))}
                </Flex>
            </main>
            </>
        );
    }
}

export default TeamBudget;