'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Calculator
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          A simple calculator for basic arithmetic operations
        </p>
      </div>

      <div 
        className="rounded-lg shadow-lg p-6 border"
        style={{ 
          backgroundColor: 'var(--card-background)', 
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="mb-4">
          <div 
            className="p-4 rounded-lg text-right text-2xl font-mono"
            style={{ 
              backgroundColor: 'var(--background)', 
              color: 'var(--foreground)',
              border: '1px solid var(--border-color)'
            }}
          >
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={clear}
            className="col-span-2 bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => inputOperation('/')}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ÷
          </button>
          <button
            onClick={() => inputOperation('*')}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ×
          </button>

          <button
            onClick={() => inputNumber('7')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            7
          </button>
          <button
            onClick={() => inputNumber('8')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            8
          </button>
          <button
            onClick={() => inputNumber('9')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            9
          </button>
          <button
            onClick={() => inputOperation('-')}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            -
          </button>

          <button
            onClick={() => inputNumber('4')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            4
          </button>
          <button
            onClick={() => inputNumber('5')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            5
          </button>
          <button
            onClick={() => inputNumber('6')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            6
          </button>
          <button
            onClick={() => inputOperation('+')}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            +
          </button>

          <button
            onClick={() => inputNumber('1')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            1
          </button>
          <button
            onClick={() => inputNumber('2')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            2
          </button>
          <button
            onClick={() => inputNumber('3')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            3
          </button>
          <button
            onClick={performCalculation}
            className="row-span-2 bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            =
          </button>

          <button
            onClick={() => inputNumber('0')}
            className="col-span-2 bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            0
          </button>
          <button
            onClick={() => inputNumber('.')}
            className="bg-gray-200 text-gray-800 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
}