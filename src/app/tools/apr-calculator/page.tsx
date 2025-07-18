'use client';

import { useState, useEffect } from 'react';

export default function APRCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [termUnit, setTermUnit] = useState<'months' | 'years'>('years');
  const [additionalFees, setAdditionalFees] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  
  const [results, setResults] = useState<{
    apr: number;
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    effectiveRate: number;
  } | null>(null);

  const calculateAPR = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const termInMonths = termUnit === 'years' ? parseFloat(loanTerm) * 12 : parseFloat(loanTerm);
    const fees = parseFloat(additionalFees) || 0;
    
    if (!principal || !rate || !termInMonths) {
      return;
    }

    // Calculate monthly payment using standard loan payment formula
    const monthlyRate = rate / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                          (Math.pow(1 + monthlyRate, termInMonths) - 1);
    
    // Calculate total payment and interest
    const totalPayment = monthlyPayment * termInMonths;
    const totalInterest = totalPayment - principal;
    
    // Calculate APR including fees
    const totalCost = totalPayment + fees;
    const effectiveRate = ((totalCost - principal) / principal) / (termInMonths / 12);
    
    // APR calculation (simplified)
    const apr = effectiveRate * 100;
    
    // Effective annual rate with compounding
    let effectiveAnnualRate = rate;
    if (compoundingFrequency === 'monthly') {
      effectiveAnnualRate = Math.pow(1 + rate / 12, 12) - 1;
    } else if (compoundingFrequency === 'quarterly') {
      effectiveAnnualRate = Math.pow(1 + rate / 4, 4) - 1;
    }
    
    setResults({
      apr: apr,
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalPayment: totalPayment,
      effectiveRate: effectiveAnnualRate * 100
    });
  };

  const handleClear = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setAdditionalFees('');
    setResults(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          APR Calculator
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Calculate the Annual Percentage Rate (APR) for loans including fees and compounding
        </p>
      </div>

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
              Loan Details
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
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="5.25"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Loan Term
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="30"
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
                    Unit
                  </label>
                  <select
                    value={termUnit}
                    onChange={(e) => setTermUnit(e.target.value as 'months' | 'years')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Additional Fees ($) <span className="text-sm" style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <input
                  type="number"
                  value={additionalFees}
                  onChange={(e) => setAdditionalFees(e.target.value)}
                  placeholder="0"
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
                  Compounding Frequency
                </label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value as 'monthly' | 'quarterly' | 'annually')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={calculateAPR}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                disabled={!loanAmount || !interestRate || !loanTerm}
              >
                Calculate APR
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
        </div>

        {/* Results Section */}
        <div className="space-y-6">
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
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Annual Percentage Rate</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPercentage(results.apr)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly Payment</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(results.monthlyPayment)}
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Interest</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(results.totalInterest)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Payment</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(results.totalPayment)}
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Effective Rate</div>
                    <div className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatPercentage(results.effectiveRate)}
                    </div>
                  </div>
                </div>
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
              About APR
            </h2>
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>APR (Annual Percentage Rate)</strong> represents the yearly cost of borrowing money, including interest and fees.
              </p>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>Why APR matters:</strong> It allows you to compare different loan offers on an equal basis, as it includes both interest rates and additional costs.
              </p>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>APR vs Interest Rate:</strong> While interest rate is the cost of borrowing the principal amount, APR includes additional fees like origination fees, closing costs, and other charges.
              </p>
              <p>
                <strong style={{ color: 'var(--foreground)' }}>Note:</strong> This calculator provides estimates. Actual APR may vary based on specific loan terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}