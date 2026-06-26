import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Textarea,
  Button,
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
  Checkbox,
  Text,
  Divider,
  Badge,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useBillParser } from '../hooks/useBillParser';
import { useAppState } from '../hooks/useAppState';

export default function BillParser() {
  const { parse, getExample, isParsing, parseError } = useBillParser();
  const { state, addPeople } = useAppState();
  const [text, setText] = useState('');
  const toast = useToast();

  // 未知人名確認彈窗狀態
  const [showUnknownModal, setShowUnknownModal] = useState(false);
  const [unknownNames, setUnknownNames] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [pendingText, setPendingText] = useState('');

  // 重複項目確認彈窗狀態
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [duplicateActions, setDuplicateActions] = useState({});
  const [pendingParseResult, setPendingParseResult] = useState(null);

  const handleParse = () => {
    if (!text.trim()) {
      toast({
        title: '請輸入帳單內容',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const result = parse(text);

    if (result) {
      // 檢查是否有未知人名
      if (result.hasUnknownNames && result.unknownNames.length > 0) {
        setUnknownNames(result.unknownNames);
        setSelectedNames(result.unknownNames.map(n => n.name)); // 預設全選
        setPendingText(result.text);
        setShowUnknownModal(true);
        return;
      }

      // 正常解析完成
      const { party, personal, advance } = result;
      const total = party.length + personal.length + advance.length;

      toast({
        title: '解析成功！',
        description: `已新增 ${total} 筆費用記錄`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 清空輸入框
      setText('');
    }
  };

  const handleToggleName = (name) => {
    setSelectedNames(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const handleSelectAll = () => {
    setSelectedNames(unknownNames.map(n => n.name));
  };

  const handleDeselectAll = () => {
    setSelectedNames([]);
  };

  const handleConfirmNames = () => {
    // 加入選中的人員
    if (selectedNames.length > 0) {
      const addedCount = addPeople(selectedNames);
      toast({
        title: `已新增 ${addedCount} 位參加人員`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }

    // 重新解析（跳過未知人名提示）
    const result = parse(pendingText, { skipUnknownPrompt: true });

    if (result) {
      // 檢查重複項目
      const duplicates = detectDuplicates(result);

      if (duplicates.length > 0) {
        // 有重複項目，顯示重複確認彈窗
        setDuplicateGroups(duplicates);
        const initialActions = {};
        duplicates.forEach((group, idx) => {
          initialActions[idx] = 'delete'; // 預設刪除重複項
        });
        setDuplicateActions(initialActions);
        setPendingParseResult(result);
        setShowUnknownModal(false);
        setShowDuplicateModal(true);
      } else {
        // 無重複，直接新增
        applyParseResult(result);
      }
    }

    // 清理未知人名彈窗狀態
    setUnknownNames([]);
    setSelectedNames([]);
    setPendingText('');
  };

  // 偵測重複項目
  const detectDuplicates = (result) => {
    const { party, personal, advance } = result;
    const duplicates = [];

    // 檢測派對費用重複
    const partyMap = new Map();
    party.forEach((item, idx) => {
      const key = `${item.cat}-${item.item}-${item.price}`;
      if (!partyMap.has(key)) {
        partyMap.set(key, []);
      }
      partyMap.get(key).push({ type: 'party', index: idx, item });
    });

    partyMap.forEach((items, key) => {
      if (items.length > 1) {
        duplicates.push({
          type: 'party',
          key,
          items,
          count: items.length,
        });
      }
    });

    // 檢測個人費用重複
    const personalMap = new Map();
    personal.forEach((item, idx) => {
      const key = `${item.person}-${item.item}-${item.price}`;
      if (!personalMap.has(key)) {
        personalMap.set(key, []);
      }
      personalMap.get(key).push({ type: 'personal', index: idx, item });
    });

    personalMap.forEach((items, key) => {
      if (items.length > 1) {
        duplicates.push({
          type: 'personal',
          key,
          items,
          count: items.length,
        });
      }
    });

    // 檢測代付重複
    const advanceMap = new Map();
    advance.forEach((item, idx) => {
      const key = `${item.person}-${item.item}-${item.price}`;
      if (!advanceMap.has(key)) {
        advanceMap.set(key, []);
      }
      advanceMap.get(key).push({ type: 'advance', index: idx, item });
    });

    advanceMap.forEach((items, key) => {
      if (items.length > 1) {
        duplicates.push({
          type: 'advance',
          key,
          items,
          count: items.length,
        });
      }
    });

    return duplicates;
  };

  // 套用解析結果
  const applyParseResult = (result) => {
    const { party, personal, advance } = result;
    const total = party.length + personal.length + advance.length;

    toast({
      title: '解析成功！',
      description: `已新增 ${total} 筆費用記錄`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // 清空
    setText('');
  };

  const handleDuplicateAction = (groupIdx, action) => {
    setDuplicateActions(prev => ({
      ...prev,
      [groupIdx]: action
    }));
  };

  const handleConfirmDuplicates = () => {
    if (!pendingParseResult) return;

    const { party, personal, advance } = pendingParseResult;
    const deleteIndices = { party: new Set(), personal: new Set(), advance: new Set() };

    // 根據用戶選擇標記要刪除的項目
    duplicateGroups.forEach((group, idx) => {
      const action = duplicateActions[idx];

      if (action === 'delete') {
        // 刪除所有重複項（保留第一筆）
        group.items.slice(1).forEach(item => {
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
        group.items.slice(1).forEach(item => {
          deleteIndices[item.type].add(item.index);
        });
      }
      // 'keep' 則保留所有項目，不做任何處理
    });

    // 過濾掉要刪除的項目
    const finalParty = party.filter((_, idx) => !deleteIndices.party.has(idx));
    const finalPersonal = personal.filter((_, idx) => !deleteIndices.personal.has(idx));
    const finalAdvance = advance.filter((_, idx) => !deleteIndices.advance.has(idx));

    // 套用最終結果
    applyParseResult({
      party: finalParty,
      personal: finalPersonal,
      advance: finalAdvance
    });

    // 關閉彈窗
    setShowDuplicateModal(false);
    setDuplicateGroups([]);
    setDuplicateActions({});
    setPendingParseResult(null);
  };

  const handleCancelDuplicates = () => {
    setShowDuplicateModal(false);
    setDuplicateGroups([]);
    setDuplicateActions({});
    setPendingParseResult(null);
  };

  const handleCancelModal = () => {
    setShowUnknownModal(false);
    setUnknownNames([]);
    setSelectedNames([]);
    setPendingText('');
  };

  const handleLoadExample = () => {
    setText(getExample());
    toast({
      title: '已載入範例',
      description: '您可以直接解析或修改內容',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleClear = () => {
    setText('');
  };

  const handleExport = () => {
    const { party, personal, advance } = state;

    if (party.length === 0 && personal.length === 0 && advance.length === 0) {
      toast({
        title: '沒有可匯出的資料',
        description: '請先新增費用項目',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    let exportText = '';

    // 按分類匯出派對費用
    const categoryMap = new Map();
    party.forEach((item) => {
      const cat = item.cat || '未分類';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat).push(item);
    });

    categoryMap.forEach((items, category) => {
      // 如果分類名稱已經包含「費用」就不重複加，否則加上「費用」
      const categoryName = category.includes('費用') ? category : `${category}費用`;
      exportText += `--------------- ${categoryName} ---------------\n`;
      items.forEach((item) => {
        // 品項名稱已包含 $ 符號時不重複加
        const itemText = item.item.includes('$') ? item.item : `${item.item} $${item.price}`;
        exportText += `${itemText}\n`;
      });
      exportText += '\n';
    });

    // 匯出個人費用
    if (personal.length > 0) {
      if (exportText) exportText += '\n';
      exportText += `--------------- 個人費用 ---------------\n`;
      personal.forEach((item) => {
        const itemText = item.item.includes('$') ? item.item : `${item.item} $${item.price}`;
        exportText += `${item.person} ${itemText}\n`;
      });
      exportText += '\n';
    }

    // 匯出代付項目
    if (advance.length > 0) {
      if (exportText) exportText += '\n';
      exportText += `--------------- 代付項目 ---------------\n`;
      advance.forEach((item) => {
        const itemText = item.item.includes('$') ? item.item : `${item.item} $${item.price}`;
        exportText += `${item.person} 出 ${itemText}\n`;
      });
    }

    // 設定到輸入框
    setText(exportText.trim());

    toast({
      title: '匯出成功！',
      description: '已將費用資料匯出到輸入框，可複製或重新解析',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">📝 帳單解析</Heading>

        <Alert status="info" borderRadius="md" fontSize="sm">
          <AlertIcon />
          <VStack align="start" spacing={1} flex={1}>
            <Box>支援格式：</Box>
            <Box>• 個人費用：小明 珍奶 50元</Box>
            <Box>• 代付：小明 出 披薩 300元</Box>
            <Box>• 派對費用：雞排 80元</Box>
          </VStack>
        </Alert>

        {/* 按鈕組 */}
        <HStack>
          <Button
            colorScheme="blue"
            onClick={handleLoadExample}
            size="sm"
          >
            📄 載入範例
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleExport}
            size="sm"
          >
            📤 匯出
          </Button>
          <Button
            colorScheme="green"
            onClick={handleParse}
            isLoading={isParsing}
            loadingText="解析中"
            size="sm"
          >
            ⚡ 解析帳單
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            size="sm"
          >
            🗑️ 清空
          </Button>
        </HStack>

        {/* 解析錯誤提示 */}
        {parseError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {parseError}
          </Alert>
        )}

        {/* 文字輸入區 */}
        <Textarea
          placeholder={`在此貼上帳單內容...

範例：
--------------- 雞蛋糕費用 ---------------
牛奶糖 $33
乳酪 $121

--------------- 飲料費用 ---------------
小明 胭脂歐蕾 $78 溫無糖
小華 熟成榛果歐蕾 $80 微冰無糖

--------------- 點心費用 ---------------
小明 出 大布丁 167元`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          minH="300px"
          fontFamily="monospace"
          fontSize="sm"
        />

        <HStack justify="space-between" fontSize="xs" color="gray.500">
          <Box>已輸入 {text.length} 字元</Box>
          <Box>共 {text.split('\n').length} 行</Box>
        </HStack>
      </VStack>

      {/* 未知人名確認彈窗 */}
      <Modal isOpen={showUnknownModal} onClose={handleCancelModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>偵測到可能的新成員</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="info" borderRadius="md" fontSize="sm">
                <AlertIcon />
                以下詞彙可能是人名或綽號，請勾選要加入參加人員的項目
              </Alert>

              <Divider />

              {/* 全選/取消全選 */}
              <HStack justify="space-between">
                <Text fontWeight="600" fontSize="sm">
                  偵測到 {unknownNames.length} 個可能的人名
                </Text>
                <HStack spacing={2}>
                  <Button size="xs" variant="ghost" onClick={handleSelectAll}>
                    全選
                  </Button>
                  <Button size="xs" variant="ghost" onClick={handleDeselectAll}>
                    取消全選
                  </Button>
                </HStack>
              </HStack>

              {/* 名單 */}
              <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                {unknownNames.map(({ name, count }) => (
                  <Box
                    key={name}
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Checkbox
                      isChecked={selectedNames.includes(name)}
                      onChange={() => handleToggleName(name)}
                      width="100%"
                    >
                      <HStack justify="space-between" width="100%">
                        <Text fontWeight="500">{name}</Text>
                        <Badge colorScheme="blue" fontSize="xs">
                          出現 {count} 次
                        </Badge>
                      </HStack>
                    </Checkbox>
                  </Box>
                ))}
              </VStack>

              {selectedNames.length > 0 && (
                <Alert status="success" borderRadius="md" fontSize="sm">
                  <AlertIcon />
                  已選擇 {selectedNames.length} 位：{selectedNames.join('、')}
                </Alert>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancelModal}>
              取消
            </Button>
            <Button colorScheme="blue" onClick={handleConfirmNames}>
              確認加入並繼續解析
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
