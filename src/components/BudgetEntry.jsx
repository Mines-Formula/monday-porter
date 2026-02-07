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
            console.error("Failed to save budget properly:", err);
        } finally {
            setSaving(false);
        }
    };

    const totalBudget = Object.values(localBudgets).reduce((sum, val) => sum + (val || 0), 0);

    return (
        <Card.Root>
            <Card.Header>
                <HStack justify="space-between">
                    <HStack gap="2">
                        <DollarSign size={20} />
                        <VStack align="start" gap="0">
                            <Text fontWeight="600" textStyle="lg">
                                Budget Entry
                            </Text>
                            <Text color="fg.muted" textStyle="sm">
                                Set budget allocations per subsystem
                            </Text>
                        </VStack>
                    </HStack>

                    <Badge colorPallette="blue" px="3" py="1">
                        Total: ${totalBudget.toLocaleString()}
                    </Badge>
                </HStack>
            </Card.Header>

            <Card.Body>
                <Stack gap="4">
                    {SUBSYSTEMS.map(subsystem => (
                        <Field.Root key={subsystem}>
                            <Field.Label>{subsystem}</Field.Label>
                            <HStack>
                                <Input type="number" min="0" step="100" placeholder="0" value={localBudgets[subsystem] ?? ""} onChange={e => handleChange(subssystem, e.target.value)} />
                                <Text color="fg.muted" minW="16">
                                    ${(localBudgets[subsystem] || 0).toLocalString()}
                                </Text>
                            </HStack>
                        </Field.Root>
                    ))}
                </Stack>
            </Card.Body>

            <Card.Footer>
                <Button colorPalette="blue" w="full" onClick={onOpen}>
                    <Save size={16} />
                    Save Budgets
                </Button>
            </Card.Footer>

            {/* Justiciation Dialog */}
            <Dialog.Root open={open} onOpenChange={e => !e.open && onClose()}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    Budget Change Justification
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <Field.Root>
                                    <Field.Label>
                                        Why are you changing the budget?
                                    </Field.Label>
                                    <Textarea placeholder="Enter justification for this budget change..." value={justification} onChange={e => setJustification(e.target.value)}
                                    rows={4}
                                    />
                                    <Field.HelperText>
                                        This will be recorded in the changelog.
                                    </Field.HelperText>
                                </Field.Root>
                            </Dialog.Body>

                            <Dialog.Footer gap="3">
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorPalette="blue" onClick={handleConfirmSave} disabled={!justification.trim()} loading={saved}>
                                    Confirm Save
                                </Button>
                            </Dialog.Footer>

                            <Dialog.CloseTrigger asChild>
                                <Button variant="ghost" size="sm" position="absolute" top="2" right="2">
                                    <X size={16} />
                                </Button>
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Card.Root>
    );

}