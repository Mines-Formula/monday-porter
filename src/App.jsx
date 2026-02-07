import { Box, Container, Heading, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import monday from "./monday";

import BudgetOverview from "./components/BudgetOverview";
import BudgetEntry from "./components/BudgetEntry";
import BudgetChangelog from "./components/BudgetChangelog";

function App() {
    const [context, setContext] = useState(null);

    useEffect(() => {
        monday.get("context").then(setContext);
    }, []);

    if (!context) {
        return <Text p="6">Loading Monday context…</Text>;
    }
    
    return (
        <Box bg="gray.50" minH="100vh" py="6">
            <Container maxW="6xl">
                <Heading mb="4">Budget Management</Heading>

                <Tabs variant="enclosed">
                    <Tabs.List>
                        <Tabs.Tab>Overview</Tabs.Tab>
                        <Tabs.Tab>Budget Entry</Tabs.Tab>
                        <Tabs.Tab>Changelog</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel>
                        <BudgetOverview />
                    </Tabs.Panel>

                    <Tabs.Panel>
                        <BudgetEntry />
                    </Tabs.Panel>

                    <Tabs.Panel>
                        <BudgetChangelog />
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </Box>
    );
}

export default App;