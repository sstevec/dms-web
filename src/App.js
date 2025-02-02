// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/Login/SignUpPage';
import HomePage from './pages/Home/HomePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import FreeAccountsPage from './pages/People/FreeAccountsPage';
import LinkedAccountsPage from './pages/People/LinkedAccountsPage';
import RegisteredPage from './pages/Product/RegisteredPage';
import AuthorizedPage from './pages/Product/AuthorizedPage';
import GroupAssignmentPage from './pages/Product/GroupAssignmentPage';
import MyOrderPage from './pages/Order/MyOrderPage';
import ReportPage from './pages/Order/ReportPage';
import SummaryPage from './pages/Commission/SummaryPage';
import HistoryPage from './pages/Commission/HistoryPage';
import CalculatorPage from './pages/Commission/CalculatorPage';

function App() {

  // Quick helper to see if user is logged in (token is in localStorage)
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
      <Router>
        <Routes>
          {/* If not authenticated, go to login */}
          <Route
              path="/"
              element={
                isAuthenticated()
                    ? <Navigate to="/home/dashboard" replace />
                    : <Navigate to="/login" replace />
              }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected area */}
          <Route path="/home" element={<HomePage />}>
            <Route path="dashboard" element={<DashboardPage />} />

            {/*/!* People *!/*/}
            <Route path="people/free-accounts" element={<FreeAccountsPage />} />
            <Route path="people/linked-accounts" element={<LinkedAccountsPage />} />

            {/*/!* Product *!/*/}
            <Route path="product/registered" element={<RegisteredPage />} />
            <Route path="product/authorized" element={<AuthorizedPage />} />
            <Route path="product/group-assignment" element={<GroupAssignmentPage />} />

            {/*/!* Order *!/*/}
            {/*<Route path="order/my-order" element={<MyOrderPage />} />*/}
            {/*<Route path="order/report" element={<ReportPage />} />*/}

            {/*/!* Commission *!/*/}
            {/*<Route path="commission/summary" element={<SummaryPage />} />*/}
            {/*<Route path="commission/history" element={<HistoryPage />} />*/}
            {/*<Route path="commission/calculator" element={<CalculatorPage />} />*/}
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
