import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  console.log("Analytics component loaded!");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [analyticsResponse, weeklyResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics', { headers }),
        axios.get('http://localhost:5000/api/analytics/weekly', { headers })
      ]);

      const analytics = analyticsResponse.data;
      const weeklyData = weeklyResponse.data;

      setAnalyticsData({
        ...analytics,
        weeklyData: weeklyData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const weeklyChartData = {
    labels: analyticsData?.weeklyData.map(item => item.day) || [],
    datasets: [
      {
        label: 'Work Sessions',
        data: analyticsData?.weeklyData.map(item => item.workSessions) || [],
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Total Time (minutes)',
        data: analyticsData?.weeklyData.map(item => item.totalTime) || [],
        borderColor: 'rgb(118, 75, 162)',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const productivityData = {
    labels: ['Productive', 'Remaining'],
    datasets: [
      {
        data: [analyticsData?.productivityScore || 0, 100 - (analyticsData?.productivityScore || 0)],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(240, 240, 240, 0.3)'
        ],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  };

  const taskCompletionData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [analyticsData?.taskCompletionRate || 0, 100 - (analyticsData?.taskCompletionRate || 0)],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(240, 240, 240, 0.3)'
        ],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  };

  const focusTimeData = {
    labels: ['Focus Time', 'Break Time'],
    datasets: [
      {
        data: [analyticsData?.focusTimePercentage || 0, 100 - (analyticsData?.focusTimePercentage || 0)],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(240, 240, 240, 0.3)'
        ],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Progress'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading || !analyticsData) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-message">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={fetchAnalyticsData} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log("analyticsData:", analyticsData);
  console.log("analyticsData.weeklyData:", analyticsData.weeklyData);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <p>Track your productivity and performance</p>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Weekly Progress</h3>
          <Line data={weeklyChartData} options={chartOptions} />
        </div>
        
        <div className="chart-card">
          <h3>Productivity Score</h3>
          <div className="doughnut-container">
            <Doughnut data={productivityData} options={doughnutOptions} />
            <div className="doughnut-center">
              <span className="doughnut-value">{analyticsData.productivityScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Task Completion</h3>
          <div className="doughnut-container">
            <Doughnut data={taskCompletionData} options={doughnutOptions} />
            <div className="doughnut-center">
              <span className="doughnut-value">{analyticsData.taskCompletionRate}%</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Focus Time Distribution</h3>
          <div className="doughnut-container">
            <Doughnut data={focusTimeData} options={doughnutOptions} />
            <div className="doughnut-center">
              <span className="doughnut-value">{analyticsData.focusTimePercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>💡 Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Peak Performance</h4>
              <p>You're most productive on {analyticsData.bestDay}. Try to schedule important tasks on this day.</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Consistency</h4>
              <p>You've maintained a {analyticsData.productivityScore}% productivity score this week. {analyticsData.productivityScore >= 80 ? 'Excellent work!' : analyticsData.productivityScore >= 60 ? 'Good progress!' : 'Keep pushing!'}</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Focus Time</h4>
              <p>You've spent {formatTime(analyticsData.totalTime)} in focused work this week with {analyticsData.focusTimePercentage}% focus efficiency.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">✅</div>
            <div className="insight-content">
              <h4>Task Completion</h4>
              <p>You've completed {analyticsData.completedTasks} out of {analyticsData.totalTasks} tasks ({analyticsData.taskCompletionRate}% completion rate).</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🔄</div>
            <div className="insight-content">
              <h4>Session Balance</h4>
              <p>You completed {analyticsData.workSessions} work sessions and {analyticsData.breakSessions} break sessions this week.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">📅</div>
            <div className="insight-content">
              <h4>Consistency Score</h4>
              <p>Your consistency score is {analyticsData.consistencyScore}%. {analyticsData.consistencyScore >= 80 ? 'Amazing consistency!' : analyticsData.consistencyScore >= 60 ? 'Good consistency!' : 'Try to be more consistent!'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 