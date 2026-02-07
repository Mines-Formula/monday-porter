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
}