import { useEffect, useState } from "react";
import monday from "../monday";

export default function useBudgetData() {
    const [budgets, setBudgets] = useState({});
    const [changelog, setChangelog] = useState([]);

    useEffect(() => {
        monday.storage.getItem("budgets").then(res => {
            if (res.data) setBudgets(res.data);
        });

        monday.storage.getItem("changelog").then(res => {
            if (res.data) setChangelog(res.data);
        });

    }, []);

    const saveBudets = async (newBudgets, justification) => {
        const changes = Objects.keys(newBudgets).map(key => ({
            subsystem: key,
            before: budgets[key] || 0,
            after: newBudgets[key],
            change: newBudgets[key] - (budgets[key] || 0),
            justification,
            date: new Date().toISOString()
        }));

        const updatedLog = [...changelog, ...changes];

        await monday.storage.setItem("budgets", newBudgets);
        await monday.storage.setItem("changelog", updatedLog);

        setBudgets(newBudgets);
        setChangelog(updatedLog);
    };

    return { budgets, changelog, saveBudgets };
}