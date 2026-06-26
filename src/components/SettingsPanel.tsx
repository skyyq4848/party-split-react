import {
  Box,
  VStack,
  HStack,
  Select,
  Checkbox,
  Text,
  Heading,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAppState } from '../hooks/useAppState';

export default function SettingsPanel() {
  const { state, setPrimaryPayer, setConsolidateAdvance } = useAppState();

  const handlePrimaryPayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrimaryPayer(e.target.value);
  };

  const handleConsolidateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsolidateAdvance(e.target.checked);
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">⚙️ 進階設定</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* 主要付錢人 */}
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="500" fontSize="sm">
              主要付錢人
            </Text>
            <Select
              value={state.primaryPayer}
              onChange={handlePrimaryPayerChange}
              size="sm"
              placeholder="（未選擇）"
            >
              {state.people.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </Select>
            <Text fontSize="xs" color="gray.500">
              設定後，新解析的費用會預設由此人付款
            </Text>
          </VStack>

          {/* 合併代付 */}
          <VStack align="stretch" spacing={2}>
            <Checkbox
              isChecked={state.consolidateAdvance}
              onChange={handleConsolidateChange}
              size="sm"
            >
              <Text fontWeight="500" fontSize="sm">
                合併代付至主要付錢人
              </Text>
            </Checkbox>
            <Text fontSize="xs" color="gray.500" pl={6}>
              勾選後，所有代付款項會統一向主要付錢人收取
            </Text>
          </VStack>
        </SimpleGrid>

        <Divider />

        {/* 當前設定摘要 */}
        <Box bg="gray.50" p={3} borderRadius="md" fontSize="sm">
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between">
              <Text color="gray.600">主要付錢人：</Text>
              <Text fontWeight="600">
                {state.primaryPayer || '（未設定）'}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">合併代付：</Text>
              <Text fontWeight="600">
                {state.consolidateAdvance ? '✓ 已啟用' : '✗ 未啟用'}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">解析模式：</Text>
              <Text fontWeight="600">
                {state.parseMode === 'auto' ? '自動模式' : '手動模式'}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
