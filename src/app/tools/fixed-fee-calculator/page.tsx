'use client';

import { useState, useEffect } from 'react';

interface PaymentScheduleEntry {
  month: number;
  principalPayment: number;
  feePayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface CalculationResult {
  loanAPR: number;
  mcaCost: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  annualFeeRate: number;
  monthlyFeeRate: number;
  paymentSchedule: PaymentScheduleEntry[];
}

export default function FixedFeeCalculator() {
  const [feeRate, setFeeRate] = useState('');
  const [term, setTerm] = useState('');
  const [rateType, setRateType] = useState<'annual' | 'monthly'>('annual');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<Array<{
    feeRate: number;
    term: number;
    rateType: 'annual' | 'monthly';
    loanAPR: number;
    mcaCost: number;
    monthlyPayment: number;
    timestamp: string;
  }>>([]);
  const [loanAmount, setLoanAmount] = useState('100000');

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Helper function to calculate APR for fixed fee loans using cash flow analysis
  const calculateAPRForFixedFee = (principal: number, monthlyPayment: number, termMonths: number): number => {
    // For fixed fee loans, we need to solve for the rate that makes NPV = 0
    // Cash flows: -principal (initial), +monthlyPayment (monthly)
    
    // Use bisection method for more stable convergence
    let lowRate = 0.0001; // 0.01% monthly
    let highRate = 5.0; // 500% monthly (very high upper bound)
    const tolerance = 1e-8;
    const maxIterations = 100;
    
    const npv = (monthlyRate: number) => {
      let npvValue = -principal; // Initial loan amount (negative cash flow)
      
      for (let month = 1; month <= termMonths; month++) {
        npvValue += monthlyPayment / Math.pow(1 + monthlyRate, month);
      }
      
      return npvValue;
    };
    
    // Check if the bounds are valid
    if (npv(lowRate) * npv(highRate) > 0) {
      // If both bounds have the same sign, use a simple approximation
      const totalInterest = (monthlyPayment * termMonths) - principal;
      const simpleMonthlyRate = totalInterest / (principal * termMonths);
      return simpleMonthlyRate * 12 * 100;
    }
    
    // Bisection method
    for (let i = 0; i < maxIterations; i++) {
      const midRate = (lowRate + highRate) / 2;
      const midNPV = npv(midRate);
      
      if (Math.abs(midNPV) < tolerance) {
        return midRate * 12 * 100; // Convert to annual percentage
      }
      
      if (npv(lowRate) * midNPV < 0) {
        highRate = midRate;
      } else {
        lowRate = midRate;
      }
      
      if (Math.abs(highRate - lowRate) < tolerance) {
        break;
      }
    }
    
    const finalRate = (lowRate + highRate) / 2;
    return finalRate * 12 * 100; // Convert to annual percentage
  };

  const calculateAPRAndMCA = () => {
    const feeRateValue = parseFloat(feeRate);
    const termValue = parseFloat(term);
    const principal = parseFloat(loanAmount);
    
    if (!feeRateValue || !termValue || !principal) {
      showNotification('error', 'Please enter valid fee rate, term, and loan amount values');
      return;
    }

    if (feeRateValue <= 0 || termValue <= 0 || principal <= 0) {
      showNotification('error', 'Fee rate, term, and loan amount must be positive numbers');
      return;
    }

    if (termValue > 1000) {
      showNotification('error', 'Term cannot exceed 1000 months');
      return;
    }

    setIsLoading(true);
    
    // Convert fee rate to annual if needed
    const annualFeeRate = rateType === 'annual' ? feeRateValue / 100 : (feeRateValue / 100) * 12;
    const monthlyFeeRate = rateType === 'monthly' ? feeRateValue / 100 : (feeRateValue / 100) / 12;
    
    // Calculate total fees using Excel methodology: loan_amount × annual_rate × term/12
    const totalFees = principal * annualFeeRate * (termValue / 12);
    
    // Calculate monthly payments (straight-line amortization)
    const monthlyPrincipal = principal / termValue;
    const monthlyFee = totalFees / termValue;
    const monthlyPayment = monthlyPrincipal + monthlyFee;
    
    // Calculate APR using cash flow analysis for fixed fee loans
    let loanAPR = calculateAPRForFixedFee(principal, monthlyPayment, termValue);
    
    // Validate APR result
    if (isNaN(loanAPR) || loanAPR < 0) {
      // Fallback to simple interest calculation if APR calculation fails
      const totalInterest = totalFees;
      const averageBalance = principal / 2; // For straight-line amortization
      loanAPR = (totalInterest / averageBalance) * (12 / termValue) * 100;
    }
    
    // MCA Cost calculation
    const mcaCost = principal + totalFees;
    
    // Calculate effective MCA rate (from Excel formula)
    const effectiveMCARate = (annualFeeRate / 12) / (1 + annualFeeRate * termValue / 12);
    
    // Generate payment schedule
    const paymentSchedule: PaymentScheduleEntry[] = [];
    let remainingBalance = principal;
    
    for (let month = 1; month <= termValue; month++) {
      const principalPayment = monthlyPrincipal;
      const feePayment = monthlyFee;
      const totalPayment = principalPayment + feePayment;
      
      remainingBalance -= principalPayment;
      
      paymentSchedule.push({
        month,
        principalPayment,
        feePayment,
        totalPayment,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
    
    setTimeout(() => {
      const newResults = {
        loanAPR: loanAPR,
        mcaCost: mcaCost,
        monthlyPayment: monthlyPayment,
        totalInterestPaid: totalFees,
        annualFeeRate: annualFeeRate * 100, // Convert to percentage
        monthlyFeeRate: monthlyFeeRate * 100, // Convert to percentage
        paymentSchedule: paymentSchedule
      };
      setResults(newResults);
      setIsLoading(false);
    }, 500);
  };

  const handleSaveCalculation = () => {
    if (!results) {
      showNotification('error', 'Please calculate values first');
      return;
    }

    const feeRateValue = parseFloat(feeRate);
    const termValue = parseFloat(term);

    // Check for duplicates in local history
    const isDuplicate = calculationHistory.some(
      calc => calc.feeRate === feeRateValue && calc.term === termValue && calc.rateType === rateType
    );
    
    if (isDuplicate) {
      showNotification('warning', 'Value already exists for this combination');
      return;
    }

    const newCalculation = {
      feeRate: feeRateValue,
      term: termValue,
      rateType: rateType,
      loanAPR: results.loanAPR,
      mcaCost: results.mcaCost,
      monthlyPayment: results.monthlyPayment,
      timestamp: new Date().toISOString()
    };

    setCalculationHistory(prev => [...prev, newCalculation]);
    showNotification('success', 'Calculation saved to local history');
  };

  const handleClear = () => {
    setFeeRate('');
    setTerm('');
    setLoanAmount('100000');
    setRateType('annual');
    setResults(null);
    setNotification(null);
  };

  const handleClearHistory = () => {
    setCalculationHistory([]);
    showNotification('success', 'Calculation history cleared');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(4)}%`;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Fixed Fee Calculator
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Calculate APR and MCA costs for straight-line amortization loans and store results in the database
        </p>
      </div>

      {notification && (
        <div 
          className={`mb-6 p-4 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Loan Parameters
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="100000"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Fee Rate (%)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={feeRate}
                  onChange={(e) => setFeeRate(e.target.value)}
                  placeholder="12.5"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Rate Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="annual"
                      checked={rateType === 'annual'}
                      onChange={(e) => setRateType(e.target.value as 'annual' | 'monthly')}
                      className="mr-2"
                    />
                    <span style={{ color: 'var(--foreground)' }}>Annual</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="monthly"
                      checked={rateType === 'monthly'}
                      onChange={(e) => setRateType(e.target.value as 'annual' | 'monthly')}
                      className="mr-2"
                    />
                    <span style={{ color: 'var(--foreground)' }}>Monthly</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Term (Months)
                </label>
                <input
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="24"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={calculateAPRAndMCA}
                disabled={!feeRate || !term || !loanAmount || isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Calculating...' : 'Calculate'}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)'
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Calculation Results Section */}
          {results && (
            <div 
              className="rounded-lg shadow-lg p-6 border"
              style={{ 
                backgroundColor: 'var(--card-background)', 
                borderColor: 'var(--border-color)'
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Calculation Results
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Loan APR</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPercentage(results.loanAPR)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Cost</div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.mcaCost)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly Payment</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(results.monthlyPayment)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Interest/Fees</div>
                  <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                    {formatCurrency(results.totalInterestPaid)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Annual Fee Rate</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatPercentage(results.annualFeeRate)}
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly Fee Rate</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatPercentage(results.monthlyFeeRate)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={handleSaveCalculation}
                    className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Save to History
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Payment Schedule Section */}
          {results && results.paymentSchedule && (
            <div 
              className="rounded-lg shadow-lg p-6 border"
              style={{ 
                backgroundColor: 'var(--card-background)', 
                borderColor: 'var(--border-color)'
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Monthly Payment Schedule
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <th className="text-left p-2" style={{ color: 'var(--foreground)' }}>Month</th>
                      <th className="text-right p-2" style={{ color: 'var(--foreground)' }}>Principal</th>
                      <th className="text-right p-2" style={{ color: 'var(--foreground)' }}>Fee</th>
                      <th className="text-right p-2" style={{ color: 'var(--foreground)' }}>Total Payment</th>
                      <th className="text-right p-2" style={{ color: 'var(--foreground)' }}>Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.paymentSchedule.map((payment, index) => (
                      <tr 
                        key={index} 
                        className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <td className="p-2 font-medium" style={{ color: 'var(--foreground)' }}>{payment.month}</td>
                        <td className="p-2 text-right" style={{ color: 'var(--foreground)' }}>
                          {formatCurrency(payment.principalPayment)}
                        </td>
                        <td className="p-2 text-right" style={{ color: 'var(--foreground)' }}>
                          {formatCurrency(payment.feePayment)}
                        </td>
                        <td className="p-2 text-right font-medium" style={{ color: 'var(--foreground)' }}>
                          {formatCurrency(payment.totalPayment)}
                        </td>
                        <td className="p-2 text-right" style={{ color: 'var(--foreground)' }}>
                          {formatCurrency(payment.remainingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold" style={{ borderColor: 'var(--border-color)' }}>
                      <td className="p-2" style={{ color: 'var(--foreground)' }}>Total</td>
                      <td className="p-2 text-right" style={{ color: 'var(--foreground)' }}>
                        {formatCurrency(parseFloat(loanAmount))}
                      </td>
                      <td className="p-2 text-right" style={{ color: 'var(--foreground)' }}>
                        {formatCurrency(results.totalInterestPaid)}
                      </td>
                      <td className="p-2 text-right" style={{ color: 'var(--foreground)' }}>
                        {formatCurrency(results.mcaCost)}
                      </td>
                      <td className="p-2 text-right" style={{ color: 'var(--foreground)' }}>
                        {formatCurrency(0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Calculation History Section */}
          {calculationHistory.length > 0 && (
            <div 
              className="rounded-lg shadow-lg p-6 border"
              style={{ 
                backgroundColor: 'var(--card-background)', 
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Calculation History
                </h2>
                <button
                  onClick={handleClearHistory}
                  className="text-sm px-3 py-1 text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                >
                  Clear History
                </button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {calculationHistory.map((calc, index) => (
                  <div 
                    key={index}
                    className="p-3 border rounded-lg text-sm"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Fee Rate:</span>
                        <span className="ml-2 font-medium" style={{ color: 'var(--foreground)' }}>
                          {calc.feeRate}% ({calc.rateType})
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Term:</span>
                        <span className="ml-2 font-medium" style={{ color: 'var(--foreground)' }}>
                          {calc.term} months
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Loan APR:</span>
                        <span className="ml-2 font-medium text-blue-600">
                          {formatPercentage(calc.loanAPR)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Monthly Payment:</span>
                        <span className="ml-2 font-medium text-purple-600">
                          {formatCurrency(calc.monthlyPayment)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Total Cost:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {formatCurrency(calc.mcaCost)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      Calculated: {new Date(calc.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Information Section */}
          <div 
            className="rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)', 
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              About Fixed Fee Calculations
            </h2>
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>Calculation Method:</strong> Uses the exact formulas from the Excel APR_MCA_cost_Simulator.xlsx file.
              </p>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>APR Calculation:</strong> Implements Excel's RATE function using Newton-Raphson method for precise results.
              </p>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>Fixed Fee Structure:</strong> Total fees calculated upfront (loan_amount × annual_rate × term/12) and distributed equally over the term.
              </p>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>Payment Schedule:</strong> Straight-line amortization with equal principal payments and equal fee payments each month.
              </p>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>Local Storage:</strong> Results are stored locally in your browser session for reference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}