import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDriverColor } from '../../theme/f1Colors';

const PaceChart = ({ data, selectedDrivers }) => {
  // Performance check for M3 Pro: Disable heavy animations if many drivers are selected
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.chartTitle}>Stint Analysis (5-Lap Avg)</h3>
        {selectedDrivers.length > 5 && <span style={styles.perfBadge}>High Density Mode</span>}
      </div>

      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
            
            {/* Since "lap" is now a string (e.g. "Laps 1-5"), we treat XAxis 
                as a 'category' type and slant the ticks for readability.
            */}
            <XAxis 
              dataKey="lap" 
              stroke="#444" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              interval={0}
              tick={{ angle: -35, textAnchor: 'end', dy: 10 }}
            />
            
            <YAxis 
              domain={['auto', 'auto']} 
              reversed 
              stroke="#444" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `${val}s`}
            />

            <Tooltip 
              contentStyle={styles.tooltip}
              itemStyle={styles.tooltipItem}
              cursor={{ stroke: '#333', strokeWidth: 1 }}
              formatter={(value) => [`${value}s`, 'Avg Pace']}
            />

            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ fontSize: '10px', fontWeight: '900', paddingBottom: '20px' }}
            />

            {selectedDrivers.map(driver => {
  // Defensive check: extract the code if 'driver' is an object
  const code = typeof driver === 'object' ? driver.code : driver;

  return (
    <Line 
      key={code}
      type="monotone"
      dataKey={`${code}_time`}
      stroke={getDriverColor(code)} // This was failing because 'code' was an object
      strokeWidth={3}
      dot={false}
      connectNulls
      animationDuration={1500}
    />
  );
})}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '1.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  chartTitle: {
    fontSize: '0.65rem',
    fontWeight: '900',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
  },
  perfBadge: {
    fontSize: '0.5rem',
    background: '#111',
    color: '#444',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '900',
    border: '1px solid #222',
  },
  chartWrapper: {
    height: '400px', // Increased height to accommodate slanted X-axis labels
    width: '100%',
  },
  tooltip: {
    backgroundColor: '#000',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  },
  tooltipItem: {
    fontSize: '11px',
    fontWeight: '900',
    textTransform: 'uppercase',
  }
};

export default PaceChart;