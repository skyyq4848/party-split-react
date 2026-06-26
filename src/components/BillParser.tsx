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
} from '@chakra-ui/react';
import { useBillParser } from '../hooks/useBillParser';
import { useAppState } from '../hooks/useAppState';

export default function BillParser() {
  const { parse, getExample, isParsing, parseError } = useBillParser();
  const { addPeople } = useAppState();
  const [text, setText] = useState('');
  const toast = useToast();

  // 未知人名確認彈窗狀態
  const [showUnknownModal, setShowUnknownModal] = useState(false);
  const [unknownNames, setUnknownNames] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [pendingText, setPendingText] = useState('');

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
      if (result.hasUnknownNames) {
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
    }

    // 關閉彈窗
    setShowUnknownModal(false);
    setUnknownNames([]);
    setSelectedNames([]);
    setPendingText('');
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
    </Box>
  );
}
