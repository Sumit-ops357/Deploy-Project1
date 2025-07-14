import React from 'react';
import './Analytics.css';

function Analytics() {
  // Demo data for a weekly bar chart
  const data = [3, 5, 2, 6, 4, 1, 0];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...data, 1);

  return (
    <div className="analytics">
      <h3>Weekly Productivity</h3>
      <div className="bar-chart">
        {data.map((val, idx) => (
          <div key={idx} className="bar-container">
            <div
              className="bar"
              style={{ height: `${(val / max) * 100}%` }}
              title={`${val} sessions`}
            ></div>
            <span className="bar-label">{days[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Analytics;