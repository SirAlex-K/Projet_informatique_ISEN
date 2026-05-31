import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={
          <PrivateRoute roles={['admin']}>
            <AdminPage />
          </PrivateRoute>
        } />
        <Route path="/supervisor" element={
          <PrivateRoute roles={['supervisor']}>
            <div style={{ color: '#fff', padding: '2rem', background: '#0d1117', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
              <h1>Dashboard Encadrant — à venir</h1>
            </div>
          </PrivateRoute>
        } />
        <Route path="/student" element={
          <PrivateRoute roles={['student']}>
            <div style={{ color: '#fff', padding: '2rem', background: '#0d1117', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
              <h1>Dashboard Étudiant — à venir</h1>
            </div>
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
