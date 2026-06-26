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
  Checkbox,
  Alert,
  AlertIcon,
  Divider,
  Text,
  Heading,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useAppState } from '../hooks/useAppState';

export default function GroupManager() {
  const { state, addGroup, deleteGroup, updateGroup } = useAppState();
  const [groupName, setGroupName] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleTogglePerson = (person: string) => {
    setSelectedPeople((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('請輸入群組名稱');
      return;
    }

    if (selectedPeople.length === 0) {
      alert('請至少選擇一位成員');
      return;
    }

    if (addGroup(groupName.trim(), selectedPeople)) {
      setGroupName('');
      setSelectedPeople([]);
    }
  };

  const handleDeleteGroup = (idx: number) => {
    const group = state.groups[idx];
    if (window.confirm(`確定要刪除群組「${group.name}」嗎？`)) {
      deleteGroup(idx);
    }
  };

  const handleEditGroup = (idx: number) => {
    const group = state.groups[idx];
    setGroupName(group.name);
    setSelectedPeople([...group.members]);
    setEditingIndex(idx);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    if (!groupName.trim()) {
      alert('請輸入群組名稱');
      return;
    }

    if (selectedPeople.length === 0) {
      alert('請至少選擇一位成員');
      return;
    }

    updateGroup(editingIndex, {
      name: groupName.trim(),
      members: selectedPeople,
    });

    setGroupName('');
    setSelectedPeople([]);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setGroupName('');
    setSelectedPeople([]);
    setEditingIndex(null);
  };

  const handleClearSelection = () => {
    setSelectedPeople([]);
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
          <Heading size="md">🏷️ 群組管理</Heading>
          <Badge colorScheme="purple" fontSize="sm">
            {state.groups.length} 個群組
          </Badge>
        </HStack>

        <Alert status="info" borderRadius="md" fontSize="sm">
          <AlertIcon />
          建立群組後，可快速套用到派對費用與代付項目
        </Alert>

        {/* 群組名稱輸入 */}
        <Input
          placeholder="群組名稱（例如：朋友群）"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          onFocus={() => setHasInteracted(true)}
          size="sm"
        />

        {/* 成員選擇 */}
        {state.people.length > 0 ? (
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="500" fontSize="sm">
                選擇成員：
              </Text>
              <Button
                size="xs"
                variant="ghost"
                onClick={handleClearSelection}
                isDisabled={selectedPeople.length === 0}
              >
                清除選擇
              </Button>
            </HStack>

            <Wrap spacing={2}>
              {state.people.map((person) => (
                <WrapItem key={person}>
                  <Checkbox
                    isChecked={selectedPeople.includes(person)}
                    onChange={() => handleTogglePerson(person)}
                    size="sm"
                  >
                    {person}
                  </Checkbox>
                </WrapItem>
              ))}
            </Wrap>

            {selectedPeople.length > 0 && (
              <Text fontSize="xs" color="gray.500" mt={2}>
                已選擇 {selectedPeople.length} 人：{selectedPeople.join(', ')}
              </Text>
            )}
          </Box>
        ) : hasInteracted ? (
          <Alert status="warning" borderRadius="md" fontSize="sm">
            <AlertIcon />
            請先新增參加人員
          </Alert>
        ) : null}

        {/* 操作按鈕 */}
        <HStack>
          {editingIndex === null ? (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="green"
              onClick={handleCreateGroup}
              size="sm"
              flex={1}
            >
              建立群組
            </Button>
          ) : (
            <>
              <Button
                colorScheme="blue"
                onClick={handleSaveEdit}
                size="sm"
                flex={1}
              >
                儲存變更
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancelEdit}
                size="sm"
              >
                取消
              </Button>
            </>
          )}
        </HStack>

        <Divider />

        {/* 已建立群組列表 */}
        <Box>
          <Text fontWeight="600" mb={2} fontSize="sm" color="gray.600">
            已建立群組
          </Text>

          {state.groups.length === 0 ? (
            <Alert status="info" borderRadius="md" fontSize="sm">
              <AlertIcon />
              尚未建立任何群組
            </Alert>
          ) : (
            <List spacing={2}>
              {state.groups.map((group, idx) => (
                <ListItem key={idx}>
                  <Box
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ bg: 'gray.50' }}
                    transition="background 0.2s"
                  >
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="600" fontSize="sm">
                          {group.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {group.members.join(', ')}
                        </Text>
                      </VStack>
                      <HStack spacing={1}>
                        <IconButton
                          icon={<EditIcon />}
                          size="xs"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleEditGroup(idx)}
                          aria-label="編輯"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteGroup(idx)}
                          aria-label="刪除"
                        />
                      </HStack>
                    </HStack>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
