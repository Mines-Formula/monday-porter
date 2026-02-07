import { Box, Container, Stack, HStack, VStack, Text, Heading, Button, Alert, Spinner, Tabs } from '@chakra-ui/react';
import { RotateCcw } from 'lucide-react';
import { useBudgetData } from './hooks/useBudgetData';
import BudgetEntry from './components/BudgetEntry';
import BudgetOverview from './components/BudgetOverview';
import BudgetChangelog from './components/BudgetChangelog';

function App() {
  const { budgets, actuals, subsystems, changelog, loading, error, saveBudgets, refreshActuals } = useBudgetData();

  if (loading) {
    return (
      <Container maxW="6xl" py="8">
        <VStack gap="4" py="20">
          <Spinner size="lg" colorPalette="blue" />
          <Text color="fg.muted">Loading budget data...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box bg="bg.subtle" minH="100vh" py="8">
      <Container maxW="6xl">
        <Stack gap="6">
          <HStack justify="space-between" align="start">
            <VStack align="start" gap="1">
              <Heading textStyle="2xl" fontWeight="600">Budget Management</Heading>
              <Text color="fg.muted">Track subsystem budgets and compare to actual spending</Text>
            </VStack>
            <Button
              variant="outline"
              onClick={refreshActuals}
              _hover={{ transform: 'translateY(-2px)', shadow: 'sm' }}
              transition="all 0.2s"
            >
              <RotateCcw size={16} />
              Refresh Data
            </Button>
          </HStack>

          {error && (
            <Alert.Root colorPalette="red">
              <Alert.Indicator />
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
          )}

          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="entry">Budget Entry</Tabs.Trigger>
              <Tabs.Trigger value="changelog">Changelog</Tabs.Trigger>
            </Tabs.List>

            <Box mt="6">
              <Tabs.Content value="overview">
                <BudgetOverview budgets={budgets} actuals={actuals} />
              </Tabs.Content>

              <Tabs.Content value="entry">
                <BudgetEntry
                  subsystems={subsystems}
                  onSave={saveBudgets}
                  initialBudgets={budgets}
                />
              </Tabs.Content>

              <Tabs.Content value="changelog">
                <BudgetChangelog changelog={changelog} />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
