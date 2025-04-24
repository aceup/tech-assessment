import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Dashboard from './components/Dashboard'
import OrderTable from './components/OrderTable'

import './App.css'

const App = () => (
  <Router>
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/orders">Orders</Link></li>
      </ul>
    </nav>
    <Routes>
      <Route exact path="/" element={<Dashboard />} />
      <Route path="/orders" element={<OrderTable />} />
    </Routes>
  </Router>
);

export default App

