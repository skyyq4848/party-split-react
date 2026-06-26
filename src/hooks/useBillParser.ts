import { useState } from 'react';
import { BillParser } from '../core/parser.js';
import { useAppState } from './useAppState';

export function useBillParser() {
  const { appState } = useAppState();
  const [parser] = useState(() => new BillParser(appState));
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const parse = (text: string, options?: any) => {
    setIsParsing(true);
    setParseError(null);

    try {
      const result = parser.parse(text, options);
      return result;
    } catch (err: any) {
      setParseError(err.message || '解析時發生錯誤');
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  const getExample = () => {
    return BillParser.getExample();
  };

  return {
    parse,
    getExample,
    isParsing,
    parseError,
  };
}
