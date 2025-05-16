import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import ManageUsers from './pages/ManageUsers';
import SetPassword from './pages/SetPassword';
import ReportPage from './components/reports/ReportPage';
import NotificationsPage from './pages/NotificationPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';



function App() {
  return (
    
    <Router>
        <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRole={["USER", "PROPOSAL_CREATOR"]} >
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/reports" element={<ReportPage />} />
        
        {/* Add the notifications route here */}
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;
