import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  IconButton,
  Heading,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useAppState } from '../hooks/useAppState';

interface ManualRow {
  cat: string;
  item: string;
  price: string;
  membersCsv: string;
  type: 'party' | 'personal' | 'advance';
}

export default function ManualEditor() {
  const { state, replaceAllItems } = useAppState();
  const [rows, setRows] = useState<ManualRow[]>([]);
  const toast = useToast();

  // 初始化：從現有資料載入
  useEffect(() => {
    const initialRows: ManualRow[] = [];

    // 派對費用
    state.party.forEach((item) => {
      initialRows.push({
        cat: item.cat || '',
        item: item.item || '',
        price: String(item.price || ''),
        membersCsv: item.members?.join(', ') || '',
        type: 'party',
      });
    });

    // 個人費用
    state.personal.forEach((item) => {
      initialRows.push({
        cat: '',
        item: item.item || '',
        price: String(item.price || ''),
        membersCsv: item.person || '',
        type: 'personal',
      });
    });

    // 代付項目
    state.advance.forEach((item) => {
      initialRows.push({
        cat: '',
        item: item.item || '',
        price: String(item.price || ''),
        membersCsv: [item.person, ...(item.members || [])].filter(Boolean).join(', '),
        type: 'advance',
      });
    });

    // 如果沒有任何項目，加入一個空白列
    if (initialRows.length === 0) {
      initialRows.push({
        cat: '',
        item: '',
        price: '',
        membersCsv: '',
        type: 'party',
      });
    }

    setRows(initialRows);
  }, [state.party, state.personal, state.advance]);

  const handleAddRow = () => {
    if (rows.length >= 100) {
      toast({
        title: '已達上限',
        description: '最多可新增 100 列',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setRows([
      ...rows,
      {
        cat: '',
        item: '',
        price: '',
        membersCsv: '',
        type: 'party',
      },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    if (rows.length === 1) {
      // 保留至少一列空白
      setRows([
        {
          cat: '',
          item: '',
          price: '',
          membersCsv: '',
          type: 'party',
        },
      ]);
    } else {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleCellChange = (
    index: number,
    field: keyof ManualRow,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: value,
    };
    setRows(newRows);
  };

  const handleSave = () => {
    const party: any[] = [];
    const personal: any[] = [];
    const advance: any[] = [];

    // 解析並分類
    rows.forEach((row) => {
      // 跳過全空列
      if (
        !row.cat?.trim() &&
        !row.item?.trim() &&
        !row.price?.trim() &&
        !row.membersCsv?.trim()
      ) {
        return;
      }

      const priceVal = parseFloat(row.price) || 0;
      // 解析分攤對象並去除重複
      const members = Array.from(new Set(
        row.membersCsv
          ?.split(/[,，\s]+/)
          .map((s) => s.trim())
          .filter(Boolean) || []
      ));

      if (row.type === 'party') {
        // 派對費用
        party.push({
          cat: row.cat?.trim() || '未分類',
          item: row.item?.trim() || '未命名',
          price: priceVal,
          payer: state.primaryPayer || '',
          members: members.length > 0 ? members : state.people.slice(),
        });
      } else if (row.type === 'personal') {
        // 個人費用：第一個成員為本人
        const person = members[0] || '';
        if (person) {
          personal.push({
            person: person,
            item: row.item?.trim() || '未命名',
            price: priceVal,
            payer: state.primaryPayer || person,
          });
        }
      } else if (row.type === 'advance') {
        // 代付：第一個為代付人，其餘為分攤成員
        const person = members[0] || '';
        if (person) {
          advance.push({
            person: person,
            item: row.item?.trim() || '未命名',
            price: priceVal,
            members: members.length > 1 ? members.slice(1) : state.people.slice(),
            custom: false,
          });
        }
      }
    });

    // 批次更新
    replaceAllItems(party, personal, advance);

    toast({
      title: '儲存成功！',
      description: `已儲存 ${party.length} 筆派對費用、${personal.length} 筆個人費用、${advance.length} 筆代付項目`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClear = () => {
    if (window.confirm('確定要清空所有列嗎？')) {
      setRows([
        {
          cat: '',
          item: '',
          price: '',
          membersCsv: '',
          type: 'party',
        },
      ]);
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md" overflow="visible">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">✏️ 一般模式（手動編輯）</Heading>
        </HStack>

        <Alert status="info" borderRadius="md" fontSize="sm">
          <AlertIcon />
          <VStack align="start" spacing={1} flex={1}>
            <Box>手動輸入每筆費用，彈性更高</Box>
            <Box>• 派對費用：分攤對象填寫參加人（逗號分隔）</Box>
            <Box>• 個人費用：分攤對象填寫本人姓名</Box>
            <Box>• 代付費用：第一個為代付人，其餘為分攤成員</Box>
          </VStack>
        </Alert>

        {/* 操作按鈕 */}
        <HStack>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleAddRow}
            size="sm"
          >
            新增列
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSave}
            size="sm"
          >
            💾 儲存
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            size="sm"
          >
            清空
          </Button>
        </HStack>

        {/* 表格 */}
        <Box overflowX="auto" overflowY="visible">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th w="120px">分類</Th>
                <Th w="200px">品項</Th>
                <Th w="100px">金額</Th>
                <Th>分攤對象（逗號分隔）</Th>
                <Th w="140px">類型</Th>
                <Th w="80px">操作</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, idx) => (
                <Tr key={idx}>
                  <Td>
                    <Input
                      value={row.cat}
                      onChange={(e) =>
                        handleCellChange(idx, 'cat', e.target.value)
                      }
                      size="sm"
                      placeholder="例：飲料"
                    />
                  </Td>
                  <Td>
                    <Input
                      value={row.item}
                      onChange={(e) =>
                        handleCellChange(idx, 'item', e.target.value)
                      }
                      size="sm"
                      placeholder="例：珍奶"
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        handleCellChange(idx, 'price', e.target.value)
                      }
                      size="sm"
                      placeholder="0"
                    />
                  </Td>
                  <Td>
                    <Input
                      value={row.membersCsv}
                      onChange={(e) =>
                        handleCellChange(idx, 'membersCsv', e.target.value)
                      }
                      size="sm"
                      placeholder="例：小明, 小華"
                    />
                  </Td>
                  <Td>
                    <Select
                      value={row.type}
                      onChange={(e) =>
                        handleCellChange(
                          idx,
                          'type',
                          e.target.value as 'party' | 'personal' | 'advance'
                        )
                      }
                      size="sm"
                    >
                      <option value="party">派對費用</option>
                      <option value="personal">個人費用</option>
                      <option value="advance">代付費用</option>
                    </Select>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteRow(idx)}
                      aria-label="刪除"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <HStack justify="space-between" fontSize="xs" color="gray.500">
          <Box>共 {rows.length} 列</Box>
          <Box>最多可新增 100 列</Box>
        </HStack>
      </VStack>
    </Box>
  );
}
