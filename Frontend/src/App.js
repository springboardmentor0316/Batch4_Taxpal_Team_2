import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import CSS files from styles folder
import './styles/App.css';
import './styles/Sidebar.css';
import './styles/Dashboard.css';
import './styles/Settings.css';
import './styles/Budget.css';
import './styles/TaxEstimator.css';
import './styles/TaxCalendar.css';
import './styles/Transaction.css';


// Import components
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Verification from "./pages/Verification";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Setting from "./pages/settings";
import Budget from "./pages/Budget";
import Sidebar from "./pages/Sidebar";
import Home from "./pages/Home";
import Transaction from "./pages/transaction";
import TaxEstimator from "./pages/TaxEstimator";
import TaxCalendar from "./pages/TaxCalendar";
import Reports from "./pages/Reports";


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if user is logged in
  return isAuthenticated ? (
    <div className="app-grid">
      <Sidebar />
      <main className="main-area">
        {children}
      </main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/Dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/setting" element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        } />
        <Route path="/TaxEstimator" element={
          <ProtectedRoute>
          <TaxEstimator />
        </ProtectedRoute>
      } />
        <Route path="/TaxCalendar" element={
          <ProtectedRoute>
          <TaxCalendar />
        </ProtectedRoute>
      } />

       <Route path="/transaction" element={
          <ProtectedRoute>
          <Transaction />
        </ProtectedRoute>
      } />
         <Route path="/Reports" element={
          <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />

      
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;