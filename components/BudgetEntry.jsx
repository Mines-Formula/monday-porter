import { useState } from 'react';
import { Box, Card, Stack, HStack, VStack, Text, Input, Button, Field, Badge, Dialog, Portal, Textarea, useDisclosure } from '@chakra-ui/react';
import { DollarSign, Save, X } from 'lucide-react';

const BudgetEntry = ({ subsystems, onSave, initialBudgets = {} }) => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [saving, setSaving] = useState(false);
  const [justification, setJustification] = useState('');
  const { open, onOpen, onClose } = useDisclosure();

  const handleChange = (subsystem, value) => {
    const numValue = parseFloat(value) || 0;
    setBudgets(prev => ({ ...prev, [subsystem]: numValue }));
  };

  const handleSave = () => {
    onOpen();
  };

  const handleConfirmSave = async () => {
    if (!justification.trim()) return;
    
    setSaving(true);
    try {
      await onSave(budgets, justification);
      setJustification('');
      onClose();
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <Card.Root>
      <Card.Header>
        <HStack justify="space-between">
          <HStack gap="2">
            <DollarSign size={20} />
            <VStack align="start" gap="0">
              <Text fontWeight="600" textStyle="lg">Budget Entry</Text>
              <Text color="fg.muted" textStyle="sm">Set budget allocations per subsystem</Text>
            </VStack>
          </HStack>
          <Badge colorPalette="blue" px="3" py="1">
            Total: ${totalBudget.toLocaleString()}
          </Badge>
        </HStack>
      </Card.Header>
      <Card.Body>
        <Stack gap="4">
          {subsystems.map(subsystem => (
            <Field.Root key={subsystem}>
              <Field.Label>{subsystem}</Field.Label>
              <HStack>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="0"
                  value={budgets[subsystem] || ''}
                  onChange={(e) => handleChange(subsystem, e.target.value)}
                />
                <Text color="fg.muted" minW="16">
                  ${(budgets[subsystem] || 0).toLocaleString()}
                </Text>
              </HStack>
            </Field.Root>
          ))}
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button
          colorPalette="blue"
          onClick={handleSave}
          w="full"
        >
          <Save size={16} />
          Save Budgets
        </Button>
      </Card.Footer>

      <Dialog.Root open={open} onOpenChange={(e) => e.open ? onOpen() : onClose()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Budget Change Justification</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root>
                  <Field.Label>Why are you changing the budget?</Field.Label>
                  <Textarea
                    placeholder="Enter justification for this budget change..."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    rows={4}
                  />
                  <Field.HelperText>This will be recorded in the changelog.</Field.HelperText>
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer gap="3">
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={handleConfirmSave}
                  disabled={!justification.trim()}
                  loading={saving}
                >
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
};

export default BudgetEntry;
