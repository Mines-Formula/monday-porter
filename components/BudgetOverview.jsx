import { Box, Card, Stack, HStack, VStack, Text, Progress, Badge, Grid } from '@chakra-ui/react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const BudgetOverview = ({ budgets, actuals }) => {
  const subsystems = Object.keys(budgets).filter(s => budgets[s] > 0);

  if (subsystems.length === 0) {
    return (
      <Card.Root>
        <Card.Body py="12" textAlign="center">
          <VStack gap="3" color="fg.muted">
            <TrendingUp size={40} />
            <Text>No budgets set yet</Text>
            <Text textStyle="sm">Enter budget allocations to start tracking spending</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  const getUtilization = (subsystem) => {
    const budget = budgets[subsystem] || 0;
    const spent = actuals[subsystem]?.spent || 0;
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const getStatus = (utilization) => {
    if (utilization >= 100) return { color: 'red', label: 'Over Budget', icon: AlertTriangle };
    if (utilization >= 80) return { color: 'yellow', label: 'Warning', icon: AlertTriangle };
    return { color: 'green', label: 'On Track', icon: CheckCircle };
  };

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
      {subsystems.map(subsystem => {
        const budget = budgets[subsystem] || 0;
        const spent = actuals[subsystem]?.spent || 0;
        const remaining = budget - spent;
        const utilization = getUtilization(subsystem);
        const status = getStatus(utilization);
        const StatusIcon = status.icon;

        return (
          <Card.Root key={subsystem} _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
            <Card.Body>
              <Stack gap="4">
                <HStack justify="space-between">
                  <VStack align="start" gap="1">
                    <Text fontWeight="600">{subsystem}</Text>
                    <Text textStyle="sm" color="fg.muted">
                      {actuals[subsystem]?.count || 0} items
                    </Text>
                  </VStack>
                  <Badge colorPalette={status.color}>
                    <HStack gap="1">
                      <StatusIcon size={12} />
                      <Text>{status.label}</Text>
                    </HStack>
                  </Badge>
                </HStack>

                <Box>
                  <HStack justify="space-between" mb="2">
                    <Text textStyle="sm" color="fg.muted">Spent</Text>
                    <Text fontWeight="600">${spent.toLocaleString()}</Text>
                  </HStack>
                  <Progress.Root
                    value={Math.min(utilization, 100)}
                    colorPalette={status.color}
                    size="sm"
                  >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                  <HStack justify="space-between" mt="2">
                    <Text textStyle="xs" color="fg.muted">
                      {utilization.toFixed(1)}% utilized
                    </Text>
                    <Text textStyle="xs" color="fg.muted">
                      Budget: ${budget.toLocaleString()}
                    </Text>
                  </HStack>
                </Box>

                <HStack justify="space-between" p="3" bg="bg.subtle" borderRadius="lg">
                  <Text textStyle="sm" color="fg.muted">Remaining</Text>
                  <Text fontWeight="600" color={remaining < 0 ? 'fg.error' : 'fg'}>
                    ${Math.abs(remaining).toLocaleString()}
                    {remaining < 0 && ' over'}
                  </Text>
                </HStack>
              </Stack>
            </Card.Body>
          </Card.Root>
        );
      })}
    </Grid>
  );
};

export default BudgetOverview;
