import { Box, Stack, HStack, VStack, Card, Text, Badge, Separator } from "@chakra-ui/react";

import { TrendingUp, TrendingDown, Calendar, FileText } from "lucide-react";

import useBudgetData from "../hooks/useBudgetData";

export default function BudgetChangelog() {
  const { changelog } = useBudgetData();

  const formatCurrency = amount =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);

  const formatDate = iso =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  if (!changelog || changelog.length === 0) {
    return (
      <Card.Root>
        <Card.Body py="12">
          <VStack gap="3">
            <FileText size={48} />
            <Text color="fg.muted">
              No budget changes recorded yet
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  const sorted = [...changelog].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <Stack gap="4">
      {sorted.map((entry, idx) => (
        <Card.Root key={idx}>
          <Card.Body>
            <Stack gap="3">
              <HStack justify="space-between">
                <HStack gap="2">
                  <Box
                    p="2"
                    borderRadius="md"
                    bg={entry.change >= 0 ? "green.50" : "red.50"}
                  >
                    {entry.change >= 0 ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                  </Box>

                  <VStack align="start" gap="0">
                    <Text fontWeight="600">
                      {entry.subsystem}
                    </Text>
                    <HStack gap="1" color="fg.muted" textStyle="sm">
                      <Calendar size={14} />
                      <Text>{formatDate(entry.date)}</Text>
                    </HStack>
                  </VStack>
                </HStack>

                <Badge
                  colorPalette={entry.change >= 0 ? "green" : "red"}
                >
                  {entry.change >= 0 ? "+" : ""}
                  {formatCurrency(entry.change)}
                </Badge>
              </HStack>

              <Separator />

              <HStack justify="space-between" px="2">
                <VStack align="start">
                  <Text textStyle="xs" color="fg.muted">
                    Before
                  </Text>
                  <Text fontWeight="600">
                    {formatCurrency(entry.before)}
                  </Text>
                </VStack>

                <Text color="fg.muted">→</Text>

                <VStack align="end">
                  <Text textStyle="xs" color="fg.muted">
                    After
                  </Text>
                  <Text fontWeight="600">
                    {formatCurrency(entry.after)}
                  </Text>
                </VStack>
              </HStack>

              {entry.justification && (
                <Box
                  bg="bg.subtle"
                  p="3"
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="blue.500"
                >
                  <Text
                    textStyle="sm"
                    color="fg.muted"
                    fontStyle="italic"
                  >
                    “{entry.justification}”
                  </Text>
                </Box>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      ))}
    </Stack>
  );
}
