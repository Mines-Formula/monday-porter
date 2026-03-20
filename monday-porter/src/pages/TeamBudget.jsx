import { useState, useEffect } from 'react'
import data from 'data/teamBudget.json'
import { DataList, Flex, Box } from '@chakra-ui/react'


function TeamBudget() {
    const [teamBudget, setTeamBudget] = useState([]);

    useEffect(() => { 
        setTeamBudget(data);
    }, []);

    console.log(teamBudget);

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

export default TeamBudget;