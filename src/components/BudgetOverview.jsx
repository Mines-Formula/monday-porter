import {
  Box,
  Card,
  Stack,
  HStack,
  VStack,
  Text,
  Progress,
  Badge,
  Grid
} from "@chakra-ui/react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import useBudgetData from "../hooks/useBudgetData";

export default function BudgetOverview() {
  const { budgets, actuals } = useBudgetData();

  const subsystems = Object.keys(budgets || {}).filter(
    s => budgets[s] > 0
  );

  if (subsystems.length === 0) {
    return (
      <Card.Root>
        <Card.Body py="12" textAlign="center">
          <VStack gap="3" color="fg.muted">
            <TrendingUp size={40} />
            <Text>No budgets set yet</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  const getStatus = utilization => {
    if (utilization >= 100)
      return { color: "red", label: "Over Budget", icon: AlertTriangle };
    if (utilization >= 80)
      return { color: "yellow", label: "Warning", icon: AlertTriangle };
    return { color: "green", label: "On Track", icon: CheckCircle };
  };

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="4">
      {subsystems.map(subsystem => {
        const budget = budgets[subsystem];
        const spent = actuals?.[subsystem]?.spent || 0;
        const count = actuals?.[subsystem]?.count || 0;
        const utilization = budget
          ? (spent / budget) * 100
          : 0;

        const status = getStatus(utilization);
        const StatusIcon = status.icon;

        return (
          <Card.Root key={subsystem}>
            <Card.Body>
              <Stack gap="4">
                <HStack justify="space-between">
                  <VStack align="start">
                    <Text fontWeight="600">{subsystem}</Text>
                    <Text textStyle="sm" color="fg.muted">
                      {count} items
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
                  <Progress.Root
                    value={Math.min(utilization, 100)}
                    colorPalette={status.color}
                  >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>

                  <HStack justify="space-between" mt="2">
                    <Text textStyle="xs" color="fg.muted">
                      ${spent.toLocaleString()} spent
                    </Text>
                    <Text textStyle="xs" color="fg.muted">
                      Budget: ${budget.toLocaleString()}
                    </Text>
                  </HStack>
                </Box>
              </Stack>
            </Card.Body>
          </Card.Root>
        );
      })}
    </Grid>
  );
}
