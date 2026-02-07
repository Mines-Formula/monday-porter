import { useEffect, useState } from "react";
import { Card, Stack, HStack, VStack, Text, Input, Button, Field, Badge, Dialog, Portal, Textarea, useDisclosure } from "@chakra-ui/react";
import { DollarSign, Save, X } from "lucide-react";

import useBudgetData from "../hooks/useBudgetData";

const SUBSYSTEMS = ["Driver Interface", "Aerodynamics", "Competition", "Software", "EV", "Chassis", "Manufacturing", "Club Operations", "Powertrain", "Sponsorship and Media", "Suspension", "Electrical"];

export default function BudgetEntry() {
    const { budgets, saveBudgets } = useBudgetData();

    const [localBudgets, setLocalBudgets] = useState({});
    const [justification, setJustification] = useState("");
    const [saving, setSaving] = useState(false);

    const { open, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        setLocalBudgets(budgets || {});
    }, [budgets]);

    const handleChange = (subsystem, value) => {
        const numValue = Number(value) || 0;
        setLocalBudgets(prev => ({ ...prev, [subsystem]: numValue}));
    };

    const handleConfirmSave = async () => {
        if (!justification.trim()) return;

        setSaving(true);
        try {
            await saveBudgets(localBudgets, justification);
            setJustification("");
            onClose();
        } catch (err) {
            console.error("Failed to save budget properly.");
        }
    }
}