import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Code,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useCalculator } from '../hooks/useCalculator';
import { fmtMoney } from '../core/utils.js';

export default function ResultDisplay() {
  const { calculate, result, isCalculating, error, clearResult } = useCalculator();
  const [resultText, setResultText] = useState('');
  const toast = useToast();

  const handleCalculate = () => {
    const calcResult = calculate();

    if (calcResult) {
      // 產生結果文字
      let text = '----- 結算 -----\n';
      for (const person in calcResult.balance) {
        const balance = calcResult.balance[person];
        text += `${person}: ${fmtMoney(balance)}\n`;
      }

      text += '\n----- 配對結果 -----\n';
      if (calcResult.pairLines.length > 0) {
        calcResult.pairLines.forEach((line) => {
          text += `${line}\n`;
        });
      } else {
        text += '無配對項目\n';
      }

      // 剩餘債權債務
      if (calcResult.remainingCreditors.length > 0) {
        text += '\n----- 剩餘債權 -----\n';
        calcResult.remainingCreditors.forEach((c) => {
          text += `${c.p} 尚收 ${fmtMoney(c.amt)}\n`;
        });
      }

      if (calcResult.remainingDebtors.length > 0) {
        text += '\n----- 剩餘債務 -----\n';
        calcResult.remainingDebtors.forEach((d) => {
          text += `${d.p} 尚欠 ${fmtMoney(d.amt)}\n`;
        });
      }

      setResultText(text);

      toast({
        title: '計算完成！',
        description: '結算結果已生成',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleCopy = async () => {
    if (!resultText) return;

    try {
      await navigator.clipboard.writeText(resultText);
      toast({
        title: '已複製到剪貼簿',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: '複製失敗',
        description: '請手動複製文字',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleClear = () => {
    clearResult();
    setResultText('');
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">💵 結算結果</Heading>

        {/* 操作按鈕 */}
        <HStack>
          <Button
            colorScheme="blue"
            onClick={handleCalculate}
            isLoading={isCalculating}
            loadingText="計算中"
            size="sm"
            leftIcon={<>🧮</>}
          >
            開始計算
          </Button>
          <Button
            colorScheme="green"
            onClick={handleCopy}
            isDisabled={!resultText}
            size="sm"
            leftIcon={<CopyIcon />}
          >
            複製結果
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            isDisabled={!resultText && !error}
            size="sm"
          >
            清空
          </Button>
        </HStack>

        {/* 錯誤提示 */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* 結果顯示 */}
        {resultText ? (
          <Box>
            <Code
              display="block"
              whiteSpace="pre-wrap"
              p={4}
              borderRadius="md"
              bg="gray.50"
              fontSize="sm"
              fontFamily="monospace"
            >
              {resultText}
            </Code>

            {result && (
              <>
                <Divider my={4} />

                {/* 統計摘要 */}
                <VStack align="stretch" spacing={2} fontSize="sm">
                  <Text fontWeight="600">📊 統計摘要</Text>
                  <HStack justify="space-between">
                    <Text color="gray.600">派對分攤總額：</Text>
                    <Text fontWeight="600">
                      ${fmtMoney(
                        Object.values(result.stats.partyShareMap as Record<string, number>).reduce(
                          (sum: number, val: number) => sum + val,
                          0
                        )
                      )}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">個人費用總額：</Text>
                    <Text fontWeight="600">
                      ${fmtMoney(
                        Object.values(result.stats.personalTotals as Record<string, number>).reduce(
                          (sum: number, val: number) => sum + val,
                          0
                        )
                      )}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">代付總額：</Text>
                    <Text fontWeight="600">
                      ${fmtMoney(
                        Object.values(result.stats.advancePaidMap as Record<string, number>).reduce(
                          (sum: number, val: number) => sum + val,
                          0
                        )
                      )}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">配對數量：</Text>
                    <Text fontWeight="600">{result.pairLines.length} 筆</Text>
                  </HStack>
                </VStack>
              </>
            )}
          </Box>
        ) : (
          !error && (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              點擊「開始計算」按鈕進行結算
            </Alert>
          )
        )}
      </VStack>
    </Box>
  );
}
