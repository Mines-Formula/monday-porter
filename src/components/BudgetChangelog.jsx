import { Box, Stack, HStack, VStack, Card, Text, Badge, Separator } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react';

const BudgetChangelog = ({ changelog }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedChangelog = [...changelog].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  if (changelog.length === 0) {
    return (
      <Card.Root>
        <Card.Body py="12">
          <VStack gap="3">
            <FileText size={48} color="gray" />
            <Text color="fg.muted" textAlign="center">
              No budget changes recorded yet
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Stack gap="4">
      {sortedChangelog.map((entry, idx) => (
        <Card.Root 
          key={idx}
          _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          <Card.Body>
            <Stack gap="3">
              <HStack justify="space-between" align="start">
                <HStack gap="2">
                  <Box 
                    p="2" 
                    bg={entry.change > 0 ? 'green.50' : 'red.50'} 
                    borderRadius="md"
                  >
                    {entry.change > 0 ? (
                      <TrendingUp size={20} color="green" />
                    ) : (
                      <TrendingDown size={20} color="red" />
                    )}
                  </Box>
                  <VStack align="start" gap="0">
                    <Text fontWeight="600">{entry.subsystem}</Text>
                    <HStack gap="1" color="fg.muted" textStyle="sm">
                      <Calendar size={14} />
                      <Text>{formatDate(entry.date)}</Text>
                    </HStack>
                  </VStack>
                </HStack>
                <Badge 
                  colorPalette={entry.change > 0 ? 'green' : 'red'}
                  fontSize="md"
                  px="3"
                  py="1"
                >
                  {entry.change > 0 ? '+' : ''}{formatCurrency(entry.change)}
                </Badge>
              </HStack>

              <Separator />

              <HStack justify="space-between" px="2">
                <VStack align="start" gap="0">
                  <Text textStyle="xs" color="fg.muted">Before</Text>
                  <Text fontWeight="600">{formatCurrency(entry.before)}</Text>
                </VStack>
                <Box color="fg.muted">→</Box>
                <VStack align="end" gap="0">
                  <Text textStyle="xs" color="fg.muted">After</Text>
                  <Text fontWeight="600">{formatCurrency(entry.after)}</Text>
                </VStack>
              </HStack>

              <Box 
                bg="bg.subtle" 
                p="3" 
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="blue.500"
              >
                <Text textStyle="sm" color="fg.muted" fontStyle="italic">
                  "{entry.justification}"
                </Text>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>
      ))}
    </Stack>
  );
};

export default BudgetChangelog;
