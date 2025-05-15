import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, Grid } from '@mui/material';

const IncomeExpenseChart = React.memo(({ transactions }) => {
  const { income, expenses, balance, data, currencies } = useMemo(() => {
    const totals = transactions.reduce((acc, transaction) => {
      const amount = transaction.amount;
      const currency = transaction.currency || '$';
      
      if (!acc.byCurrency[currency]) {
        acc.byCurrency[currency] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc.income += amount;
        acc.byCurrency[currency].income += amount;
      } else {
        acc.expenses += amount;
        acc.byCurrency[currency].expenses += amount;
      }
      return acc;
    }, { income: 0, expenses: 0, byCurrency: {} });
    
    const balance = totals.income - totals.expenses;
    
    const data = [
      { name: 'Ingresos', value: totals.income },
      { name: 'Egresos', value: totals.expenses }
    ].filter(item => item.value > 0);

    return {
      income: totals.income,
      expenses: totals.expenses,
      balance,
      data,
      currencies: totals.byCurrency
    };
  }, [transactions]);

  const COLORS = ['var(--success)', 'var(--error)']; // Verde para ingresos, Rojo para egresos

  if (data.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '300px'
      }}>
        <Typography variant="h6" sx={{ color: 'var(--color)' }}>
          No hay datos para mostrar
        </Typography>
      </Box>
    );
  }

  const formatCurrencyAmount = (amount, currencies) => {
    return Object.entries(currencies)
      .map(([currency, values]) => {
        const value = values[amount === 'income' ? 'income' : 'expenses'];
        return value > 0 ? `${currency}${value.toFixed(2)}` : null;
      })
      .filter(Boolean)
      .join(' + ');
  };

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom sx={{ color: 'var(--color)' }}>
        Balance General
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ color: 'var(--color)' }}>
              Ingresos
            </Typography>
            <Typography variant="h6" sx={{ color: 'var(--success)' }}>
              {formatCurrencyAmount('income', currencies)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ color: 'var(--color)' }}>
              Egresos
            </Typography>
            <Typography variant="h6" sx={{ color: 'var(--error)' }}>
              {formatCurrencyAmount('expenses', currencies)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ color: 'var(--color)' }}>
              Balance
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ color: balance >= 0 ? 'var(--success)' : 'var(--error)' }}
            >
              {Object.entries(currencies).map(([currency, values]) => {
                const currBalance = values.income - values.expenses;
                return currBalance !== 0 ? `${currency}${currBalance.toFixed(2)}` : null;
              }).filter(Boolean).join(' + ')}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => {
                return Object.entries(currencies).map(([currency, values]) => {
                  const total = values.income + values.expenses;
                  return total > 0 ? `${currency}${value.toFixed(2)}` : null;
                }).filter(Boolean).join(' + ');
              }}
              contentStyle={{
                backgroundColor: 'var(--bg-color)',
                color: 'var(--color)',
                border: '1px solid var(--border-color)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span style={{ color: 'var(--color)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
});

export default IncomeExpenseChart;
