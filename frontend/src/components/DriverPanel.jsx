import React from 'react';

const DriverPanel = ({ allDrivers, selectedDrivers, onToggle, onClear }) => {
  return (
    <div style={styles.panelContainer}>
      <div style={styles.header}>
        <h3 style={styles.title}>Driver Selection</h3>
        <button onClick={onClear} style={styles.resetBtn}>RESET GRID</button>
      </div>

      <div style={styles.grid}>
        {allDrivers.map((driver) => {
          // 1. Identify if active and get their team color
          const code = typeof driver === 'object' ? driver.code : driver;
          const isActive = selectedDrivers.includes(code);
          const teamColor = driver.color || '#444';

          return (
            <button
              key={code}
              onClick={() => onToggle(code)}
              style={{
                ...styles.driverButton,
                // 2. Dynamic Border & Glow
                borderColor: isActive ? teamColor : 'rgba(255,255,255,0.05)',
                color: isActive ? '#fff' : '#444',
                boxShadow: isActive ? `0 0 15px ${teamColor}44` : 'none',
                background: isActive ? `${teamColor}15` : 'transparent',
              }}
            >
              <span style={styles.codeText}>{code}</span>
              {/* Optional: Add a small team-colored indicator bar */}
              {isActive && <div style={{ ...styles.activeBar, background: teamColor }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  panelContainer: {
    background: '#0a0a0a',
    border: '1px solid #111',
    padding: '1.5rem',
    borderRadius: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '0.75rem',
  },
  driverButton: {
    position: 'relative',
    height: '45px',
    border: '1px solid',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease', // Smooth transition for the glow
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '900',
    fontSize: '0.8rem',
  },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: '2px',
    borderRadius: '2px 2px 0 0',
  },
  // ... other styles
};

export default DriverPanel;