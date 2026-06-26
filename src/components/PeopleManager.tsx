import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  List,
  ListItem,
  IconButton,
  Tag,
  Textarea,
  Collapse,
  useDisclosure,
  Divider,
  Text,
  Alert,
  AlertIcon,
  Heading,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useAppState } from '../hooks/useAppState';

export default function PeopleManager() {
  const { state, addPerson, deletePerson, addPeople } = useAppState();
  const [name, setName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const { isOpen, onToggle } = useDisclosure();

  const handleAdd = () => {
    if (addPerson(name)) {
      setName('');
    }
  };

  const handleBulkAdd = () => {
    const names = bulkNames
      .split(/[,，\s\n]+/)
      .map((n) => n.trim())
      .filter(Boolean);

    const count = addPeople(names);
    if (count > 0) {
      setBulkNames('');
      onToggle();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      shadow="md"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">👥 參加人員管理</Heading>
          <Tag colorScheme="blue" fontSize="sm">{state.people.length} 人</Tag>
        </HStack>

        {/* 單一新增 */}
        <HStack>
          <Input
            placeholder="輸入人名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleAdd}
            flexShrink={0}
          >
            新增
          </Button>
        </HStack>

        {/* 批次匯入 */}
        <Button variant="outline" onClick={onToggle} size="sm">
          📋 批次匯入
        </Button>

        <Collapse in={isOpen}>
          <VStack spacing={2} p={3} bg="gray.50" borderRadius="md">
            <Textarea
              placeholder="輸入多位人名（逗號、空白或換行分隔）&#10;例如：小明, 小華, 小美"
              value={bulkNames}
              onChange={(e) => setBulkNames(e.target.value)}
              rows={3}
              size="sm"
            />
            <HStack w="full">
              <Button
                colorScheme="green"
                onClick={handleBulkAdd}
                flex={1}
                size="sm"
              >
                ✓ 確認匯入
              </Button>
              <Button
                variant="ghost"
                onClick={onToggle}
                size="sm"
              >
                取消
              </Button>
            </HStack>
          </VStack>
        </Collapse>

        <Divider />

        {/* 人員清單 */}
        <Box>
          <Text fontWeight="600" mb={2} fontSize="sm" color="gray.600">
            目前人員
          </Text>

          {state.people.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">尚未新增任何人員</Text>
            </Alert>
          ) : (
            <List spacing={1}>
              {state.people.map((person, idx) => (
                <ListItem key={idx}>
                  <HStack
                    justify="space-between"
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50' }}
                    transition="background 0.2s"
                  >
                    <Text fontSize="sm">{person}</Text>
                    <IconButton
                      icon={<DeleteIcon />}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => {
                        if (window.confirm(`確定要刪除「${person}」嗎？`)) {
                          deletePerson(idx);
                        }
                      }}
                      aria-label="刪除"
                    />
                  </HStack>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
