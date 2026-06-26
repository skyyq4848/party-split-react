import { useState } from 'react';
import { Calculator } from '../core/calculator.js';
import { useAppState } from './useAppState';

export function useCalculator() {
  const { appState } = useAppState();
  const [calculator] = useState(() => new Calculator(appState));
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setIsCalculating(true);
    setError(null);

    try {
      const calculationResult = calculator.calculate();
      setResult(calculationResult);
      return calculationResult;
    } catch (err: any) {
      setError(err.message || '計算時發生錯誤');
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    calculate,
    clearResult,
    result,
    isCalculating,
    error,
  };
}
