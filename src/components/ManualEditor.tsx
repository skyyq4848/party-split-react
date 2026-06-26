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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Badge,
  Divider,
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

  // 重複項目確認彈窗狀態
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<any[]>([]);
  const [duplicateActions, setDuplicateActions] = useState<Record<number, string>>({});
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);

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

    // 檢查重複項目
    const duplicates = detectDuplicates({ party, personal, advance });

    if (duplicates.length > 0) {
      // 有重複項目，顯示確認彈窗
      setDuplicateGroups(duplicates);
      const initialActions: Record<number, string> = {};
      duplicates.forEach((_, idx) => {
        initialActions[idx] = 'delete'; // 預設刪除重複項
      });
      setDuplicateActions(initialActions);
      setPendingSaveData({ party, personal, advance });
      setShowDuplicateModal(true);
    } else {
      // 無重複，直接儲存
      applySave({ party, personal, advance });
    }
  };

  // 偵測重複項目
  const detectDuplicates = (data: any) => {
    const { party, personal, advance } = data;
    const duplicates: any[] = [];

    // 檢測派對費用重複
    const partyMap = new Map();
    party.forEach((item: any, idx: number) => {
      const key = `${item.cat}-${item.item}-${item.price}`;
      if (!partyMap.has(key)) {
        partyMap.set(key, []);
      }
      partyMap.get(key).push({ type: 'party', index: idx, item });
    });

    partyMap.forEach((items) => {
      if (items.length > 1) {
        duplicates.push({
          type: 'party',
          items,
          count: items.length,
        });
      }
    });

    // 檢測個人費用重複
    const personalMap = new Map();
    personal.forEach((item: any, idx: number) => {
      const key = `${item.person}-${item.item}-${item.price}`;
      if (!personalMap.has(key)) {
        personalMap.set(key, []);
      }
      personalMap.get(key).push({ type: 'personal', index: idx, item });
    });

    personalMap.forEach((items) => {
      if (items.length > 1) {
        duplicates.push({
          type: 'personal',
          items,
          count: items.length,
        });
      }
    });

    // 檢測代付重複
    const advanceMap = new Map();
    advance.forEach((item: any, idx: number) => {
      const key = `${item.person}-${item.item}-${item.price}`;
      if (!advanceMap.has(key)) {
        advanceMap.set(key, []);
      }
      advanceMap.get(key).push({ type: 'advance', index: idx, item });
    });

    advanceMap.forEach((items) => {
      if (items.length > 1) {
        duplicates.push({
          type: 'advance',
          items,
          count: items.length,
        });
      }
    });

    return duplicates;
  };

  // 套用儲存
  const applySave = (data: any) => {
    const { party, personal, advance } = data;

    replaceAllItems(party, personal, advance);

    toast({
      title: '儲存成功！',
      description: `已儲存 ${party.length} 筆派對費用、${personal.length} 筆個人費用、${advance.length} 筆代付項目`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDuplicateAction = (groupIdx: number, action: string) => {
    setDuplicateActions(prev => ({
      ...prev,
      [groupIdx]: action
    }));
  };

  const handleConfirmDuplicates = () => {
    if (!pendingSaveData) return;

    let { party, personal, advance } = pendingSaveData;
    const deleteIndices = { party: new Set<number>(), personal: new Set<number>(), advance: new Set<number>() };

    // 根據用戶選擇標記要刪除的項目
    duplicateGroups.forEach((group, idx) => {
      const action = duplicateActions[idx];

      if (action === 'delete') {
        // 刪除所有重複項（保留第一筆）
        group.items.slice(1).forEach((item: any) => {
          deleteIndices[item.type].add(item.index);
        });
      } else if (action === 'merge') {
        // 合併：保留第一筆，刪除其他，並將第一筆的價格乘以數量
        const firstItem = group.items[0];
        const totalCount = group.items.length;

        // 修改第一筆的價格
        if (firstItem.type === 'party') {
          party[firstItem.index].price *= totalCount;
        } else if (firstItem.type === 'personal') {
          personal[firstItem.index].price *= totalCount;
        } else if (firstItem.type === 'advance') {
          advance[firstItem.index].price *= totalCount;
        }

        // 刪除其他重複項
        group.items.slice(1).forEach((item: any) => {
          deleteIndices[item.type].add(item.index);
        });
      }
      // 'keep' 則保留所有項目，不做任何處理
    });

    // 過濾掉要刪除的項目
    const finalParty = party.filter((_: any, idx: number) => !deleteIndices.party.has(idx));
    const finalPersonal = personal.filter((_: any, idx: number) => !deleteIndices.personal.has(idx));
    const finalAdvance = advance.filter((_: any, idx: number) => !deleteIndices.advance.has(idx));

    // 套用最終結果
    applySave({
      party: finalParty,
      personal: finalPersonal,
      advance: finalAdvance
    });

    // 關閉彈窗
    setShowDuplicateModal(false);
    setDuplicateGroups([]);
    setDuplicateActions({});
    setPendingSaveData(null);
  };

  const handleCancelDuplicates = () => {
    setShowDuplicateModal(false);
    setDuplicateGroups([]);
    setDuplicateActions({});
    setPendingSaveData(null);
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

        {/* 底部操作按鈕 */}
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
      </VStack>

      {/* 重複項目確認彈窗 */}
      <Modal isOpen={showDuplicateModal} onClose={handleCancelDuplicates} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>偵測到重複的費用項目</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="md" fontSize="sm">
                <AlertIcon />
                發現 {duplicateGroups.length} 組重複項目，請選擇處理方式
              </Alert>

              <Divider />

              <VStack spacing={4} align="stretch" maxH="400px" overflowY="auto">
                {duplicateGroups.map((group, idx) => {
                  const firstItem = group.items[0].item;
                  const typeName = group.type === 'party' ? '派對費用' : group.type === 'personal' ? '個人費用' : '代付項目';

                  return (
                    <Box
                      key={idx}
                      p={4}
                      borderRadius="md"
                      border="1px"
                      borderColor="orange.200"
                      bg="orange.50"
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="600" fontSize="sm">
                              {typeName}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {group.type === 'party' && `${firstItem.cat} - ${firstItem.item}`}
                              {group.type === 'personal' && `${firstItem.person} - ${firstItem.item}`}
                              {group.type === 'advance' && `${firstItem.person} 出 ${firstItem.item}`}
                            </Text>
                          </VStack>
                          <Badge colorScheme="orange" fontSize="sm">
                            重複 {group.count} 次
                          </Badge>
                        </HStack>

                        <Text fontSize="sm" color="gray.600">
                          單價：${firstItem.price}　總計：${firstItem.price * group.count}
                        </Text>

                        <RadioGroup
                          value={duplicateActions[idx] || 'delete'}
                          onChange={(value) => handleDuplicateAction(idx, value)}
                        >
                          <Stack spacing={2}>
                            <Radio value="delete" size="sm">
                              <Text fontSize="sm">刪除重複項（僅保留第 1 筆，單價 ${firstItem.price}）</Text>
                            </Radio>
                            <Radio value="keep" size="sm">
                              <Text fontSize="sm">保留所有 {group.count} 筆（不處理）</Text>
                            </Radio>
                            <Radio value="merge" size="sm">
                              <Text fontSize="sm">合併為 1 筆（價格合計 ${firstItem.price * group.count}）</Text>
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </VStack>
                    </Box>
                  );
                })}
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancelDuplicates}>
              取消
            </Button>
            <Button colorScheme="orange" onClick={handleConfirmDuplicates}>
              確認處理
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
