import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import SupervisorPage       from './pages/SupervisorPage';
import SupervisorStudents   from './pages/SupervisorStudents';
import SupervisorProjects   from './pages/SupervisorProjects';
import SupervisorMessages   from './pages/SupervisorMessages';
import SupervisorEvaluation from './pages/SupervisorEvaluation';
import SupervisorGroups      from './pages/SupervisorGroups';
import SupervisorNewProject  from './pages/SupervisorNewProject';
import StudentPage          from './pages/StudentPage';

function PrivateRoute({ children, roles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/admin" element={
        <PrivateRoute roles={['admin']}>
          <AdminPage />
        </PrivateRoute>
      } />

      <Route path="/supervisor" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <SupervisorPage />
        </PrivateRoute>
      } />
      <Route path="/supervisor/projects" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <SupervisorProjects />
        </PrivateRoute>
      } />
      <Route path="/supervisor/students" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <SupervisorStudents />
        </PrivateRoute>
      } />
      <Route path="/supervisor/messages" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <SupervisorMessages />
        </PrivateRoute>
      } />
      <Route path="/supervisor/evaluation" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <SupervisorEvaluation />
        </PrivateRoute>
      } />
      <Route path="/supervisor/groups" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <SupervisorGroups />
        </PrivateRoute>
      } />
      <Route path="/supervisor/new-project" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <SupervisorNewProject />
        </PrivateRoute>
      } />

      <Route path="/student" element={
        <PrivateRoute roles={['student']}>
          <StudentPage />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
