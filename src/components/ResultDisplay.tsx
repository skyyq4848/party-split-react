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
      let text = '═════════════════════════════════\n';
      text += '           結 算 結 果\n';
      text += '═════════════════════════════════\n\n';

      text += '【餘額總覽】\n';
      text += '─────────────────────────────────\n';
      for (const person in calcResult.balance) {
        const balance = calcResult.balance[person];
        const status = balance > 0 ? '💰 應收' : balance < 0 ? '💸 應付' : '✅ 已平';
        const absBalance = Math.abs(balance);
        if (absBalance > 0.01) { // 只顯示大於 0.01 的
          text += `${person.padEnd(8)} ${status} $${fmtMoney(absBalance)}\n`;
        } else {
          text += `${person.padEnd(8)} ${status}\n`;
        }
      }

      // 定向配對明細（誰要給誰錢）- 債務整合
      if (calcResult.directedMap && Object.keys(calcResult.directedMap).length > 0) {
        text += '\n【付款明細】\n';
        text += '─────────────────────────────────\n';

        // 建立淨額對照表並整合明細
        const processed = new Set();

        for (const debtor in calcResult.directedMap) {
          for (const payer in calcResult.directedMap[debtor]) {
            const key1 = `${debtor}->${payer}`;
            const key2 = `${payer}->${debtor}`;

            if (processed.has(key1) || processed.has(key2)) continue;

            const detail1 = calcResult.directedMap[debtor]?.[payer];
            const detail2 = calcResult.directedMap[payer]?.[debtor];
            const amount1 = detail1?.total || 0;
            const amount2 = detail2?.total || 0;

            // 計算淨額
            const netAmount = amount1 - amount2;

            if (Math.abs(netAmount) > 0.01) {
              const finalFrom = netAmount > 0 ? debtor : payer;
              const finalTo = netAmount > 0 ? payer : debtor;
              const finalAmount = Math.abs(netAmount);

              text += `\n${finalFrom} → ${finalTo}  淨額 $${fmtMoney(finalAmount)}\n`;

              // 合併雙方的所有項目
              const itemMap = new Map();

              // 加入第一方的項目（正數）
              if (detail1?.items) {
                detail1.items.forEach((item) => {
                  if (Math.abs(item.amt) > 0.01) {
                    const key = item.desc;
                    if (itemMap.has(key)) {
                      itemMap.set(key, itemMap.get(key) + item.amt);
                    } else {
                      itemMap.set(key, item.amt);
                    }
                  }
                });
              }

              // 加入第二方的項目（負數 - 抵扣）
              if (detail2?.items) {
                detail2.items.forEach((item) => {
                  if (Math.abs(item.amt) > 0.01) {
                    const key = `${item.desc} (抵扣)`;
                    const amt = -item.amt;
                    if (itemMap.has(key)) {
                      itemMap.set(key, itemMap.get(key) + amt);
                    } else {
                      itemMap.set(key, amt);
                    }
                  }
                });
              }

              // 顯示整合後的項目（按金額排序）
              let count = 0;
              const maxItems = 20;
              const sortedItems = Array.from(itemMap.entries()).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

              sortedItems.forEach(([desc, amt], index) => {
                if (count < maxItems && Math.abs(amt) > 0.01) {
                  const prefix = index === sortedItems.length - 1 ? '  └ ' : '  ├ ';
                  const sign = amt >= 0 ? '+' : '';
                  text += `${prefix}${desc}  ${sign}$${fmtMoney(amt)}\n`;
                  count++;
                }
              });

              if (itemMap.size > maxItems) {
                text += `  └ ... 及其他 ${itemMap.size - maxItems} 項\n`;
              }
            }

            processed.add(key1);
            processed.add(key2);
          }
        }
      }



      text += '\n═════════════════════════════════\n';

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
