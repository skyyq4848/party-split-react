import {
  Box,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useAppState } from '../hooks/useAppState';

export default function ExpenseTables() {
  const { state, deletePartyItem, deletePersonalItem, deleteAdvanceItem } = useAppState();

  const PartyTable = () => (
    <Box overflowX="auto">
      {state.party.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          尚無派對費用記錄
        </Alert>
      ) : (
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>分類</Th>
              <Th>品項</Th>
              <Th isNumeric>金額</Th>
              <Th>分攤對象</Th>
              <Th>付款人</Th>
              <Th w="80px">操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {state.party.map((item, idx) => (
              <Tr key={idx} _hover={{ bg: 'gray.50' }}>
                <Td>{item.cat || '未分類'}</Td>
                <Td>{item.item}</Td>
                <Td isNumeric fontWeight="600">
                  ${item.price}
                </Td>
                <Td>
                  <Badge colorScheme="blue" fontSize="xs">
                    {item.members?.length || 0} 人
                  </Badge>
                </Td>
                <Td>{item.payer || '-'}</Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => {
                      if (window.confirm('確定要刪除此項目嗎？')) {
                        deletePartyItem(idx);
                      }
                    }}
                    aria-label="刪除"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  const PersonalTable = () => (
    <Box overflowX="auto">
      {state.personal.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          尚無個人費用記錄
        </Alert>
      ) : (
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>姓名</Th>
              <Th>品項</Th>
              <Th isNumeric>金額</Th>
              <Th>付款人</Th>
              <Th w="80px">操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {state.personal.map((item, idx) => (
              <Tr key={idx} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="600">{item.person}</Td>
                <Td>{item.item}</Td>
                <Td isNumeric fontWeight="600">
                  ${item.price}
                </Td>
                <Td>{item.payer || item.person}</Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => {
                      if (window.confirm('確定要刪除此項目嗎？')) {
                        deletePersonalItem(idx);
                      }
                    }}
                    aria-label="刪除"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  const AdvanceTable = () => (
    <Box overflowX="auto">
      {state.advance.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          尚無代付項目記錄
        </Alert>
      ) : (
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>代付人</Th>
              <Th>品項</Th>
              <Th isNumeric>金額</Th>
              <Th>分攤成員</Th>
              <Th w="80px">操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {state.advance.map((item, idx) => (
              <Tr key={idx} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="600">{item.person}</Td>
                <Td>{item.item}</Td>
                <Td isNumeric fontWeight="600">
                  ${item.price}
                </Td>
                <Td>
                  <Badge colorScheme="green" fontSize="xs">
                    {item.members?.length || 0} 人
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => {
                      if (window.confirm('確定要刪除此項目嗎？')) {
                        deleteAdvanceItem(idx);
                      }
                    }}
                    aria-label="刪除"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  const totalItems = state.party.length + state.personal.length + state.advance.length;

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">
          💰 費用管理
          <Badge ml={3} colorScheme="purple" fontSize="sm">
            {totalItems} 筆
          </Badge>
        </Heading>

        <Tabs colorScheme="blue" size="sm">
          <TabList>
            <Tab>
              🎊 派對費用
              <Badge ml={2} colorScheme="blue" fontSize="xs">
                {state.party.length}
              </Badge>
            </Tab>
            <Tab>
              👤 個人費用
              <Badge ml={2} colorScheme="green" fontSize="xs">
                {state.personal.length}
              </Badge>
            </Tab>
            <Tab>
              💸 代付項目
              <Badge ml={2} colorScheme="orange" fontSize="xs">
                {state.advance.length}
              </Badge>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <PartyTable />
            </TabPanel>
            <TabPanel px={0}>
              <PersonalTable />
            </TabPanel>
            <TabPanel px={0}>
              <AdvanceTable />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}
