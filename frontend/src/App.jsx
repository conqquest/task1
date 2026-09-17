import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GroupManagement from './pages/GroupManagement';
import AssignmentsList from './pages/AssignmentsList';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-black">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          {user?.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/dashboard" />}
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            {user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/groups" element={
        <ProtectedRoute>
          <Layout>
            <GroupManagement />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/assignments" element={
        <ProtectedRoute>
          <Layout>
            <AssignmentsList />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
