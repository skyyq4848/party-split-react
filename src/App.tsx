import { useState } from 'react';
import {
  ChakraProvider,
  Container,
  VStack,
  HStack,
  Heading,
  Badge,
  useColorMode,
  IconButton,
  SimpleGrid,
  Text,
  Button,
  useToast,
  ButtonGroup,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { AppStateProvider, useAppState } from './hooks/useAppState';
import PeopleManager from './components/PeopleManager';
import GroupManager from './components/GroupManager';
import BillParser from './components/BillParser';
import ManualEditor from './components/ManualEditor';
import ExpenseTables from './components/ExpenseTables';
import ResultDisplay from './components/ResultDisplay';
import SettingsPanel from './components/SettingsPanel';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </ChakraProvider>
  );
}

type ParseMode = 'auto' | 'manual';

function AppContent() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { reset } = useAppState();
  const toast = useToast();
  const [parseMode, setParseMode] = useState<ParseMode>('auto');

  const handleReset = () => {
    if (window.confirm('確定要重置所有資料嗎？此操作無法復原！')) {
      reset();
      toast({
        title: '已重置所有資料',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" pb={4} borderBottomWidth={1}>
          <VStack align="start" spacing={1}>
            <HStack spacing={3}>
              <Heading size="xl">🎉 派對分帳神器</Heading>
              <Badge colorScheme="purple" fontSize="md" px={3} py={1} borderRadius="md">
                v7.6.0 React
              </Badge>
            </HStack>
            <Text color="gray.600" fontSize="sm">
              使用 React + Chakra UI 構建 | 快速解析帳單、手動編輯與群組管理
            </Text>
          </VStack>

          <HStack>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={handleReset}
            >
              🗑️ 重置資料
            </Button>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              aria-label="切換主題"
              size="lg"
            />
          </HStack>
        </HStack>

        {/* 人員與群組管理 */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <PeopleManager />
          <GroupManager />
        </SimpleGrid>

        {/* 模式切換 */}
        <HStack
          justify="center"
          p={4}
          bg="gray.50"
          borderRadius="lg"
          shadow="sm"
        >
          <Text fontWeight="medium" fontSize="sm" color="gray.600">
            輸入模式：
          </Text>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
              colorScheme={parseMode === 'auto' ? 'blue' : 'gray'}
              onClick={() => setParseMode('auto')}
              fontWeight={parseMode === 'auto' ? 'bold' : 'normal'}
            >
              📝 解析模式
            </Button>
            <Button
              colorScheme={parseMode === 'manual' ? 'blue' : 'gray'}
              onClick={() => setParseMode('manual')}
              fontWeight={parseMode === 'manual' ? 'bold' : 'normal'}
            >
              ✏️ 一般模式
            </Button>
          </ButtonGroup>
        </HStack>

        {/* 帳單解析 或 手動編輯 */}
        {parseMode === 'auto' ? <BillParser /> : <ManualEditor />}

        {/* 設定面板 */}
        <SettingsPanel />

        {/* 費用表格 */}
        <ExpenseTables />

        {/* 結算結果 */}
        <ResultDisplay />

        {/* Footer */}
        <HStack
          justify="center"
          pt={8}
          pb={4}
          color="gray.500"
          fontSize="sm"
          borderTopWidth={1}
        >
          <Text>
            Made with ❤️ using React + Chakra UI
          </Text>
        </HStack>
      </VStack>
    </Container>
  );
}

export default App;
