import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Orders from './components/orders/Orders';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Order Management</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  location.pathname === '/'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
              >
                Dashboard
              </Link>
              
              <Link
                to="/orders"
                className={`${
                  location.pathname === '/orders'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16`}
              >
                Orders
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="/">Dashboard</option>
              <option value="/orders">Orders</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

