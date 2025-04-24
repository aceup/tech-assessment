import { useState, useEffect } from 'react';
import { ordersApi } from '../api/orders';

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    try {
      setLoading(true);
      const statistics = await ordersApi.getStatistics();
      setStats(statistics);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Order Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        
        <div className="stat-card">
          <h3>In Progress Orders</h3>
          <div className="stat-value">{stats.inProgress}</div>
        </div>
        
        <div className="stat-card">
          <h3>Completed Orders</h3>
          <div className="stat-value">{stats.completed}</div>
        </div>
        
        <div className="stat-card">
          <h3>Cancelled Orders</h3>
          <div className="stat-value">{stats.cancelled}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;