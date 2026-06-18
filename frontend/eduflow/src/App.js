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
import ProjectDetails       from './pages/ProjectDetails';
import GroupDetails         from './pages/GroupDetails';
import StudentPage          from './pages/StudentPage';
import StudentGroupSelect   from './pages/StudentGroupSelect';
import StudentKanban        from './pages/StudentKanban';
import StudentLivrables     from './pages/StudentLivrables';
import StudentNotes         from './pages/StudentNotes';
import StudentChat          from './pages/StudentChat';
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
      <Route path="/supervisor/project-details" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <ProjectDetails />
        </PrivateRoute>
      } />
      <Route path="/supervisor/group-details" element={
        <PrivateRoute roles={['supervisor', 'admin']}>
          <GroupDetails />
        </PrivateRoute>
      } />

      <Route path="/student" element={
        <PrivateRoute roles={['student']}>
          <StudentPage />
        </PrivateRoute>
      } />
      <Route path="/student/group-select" element={
        <PrivateRoute roles={['student']}>
          <StudentGroupSelect />
        </PrivateRoute>
      } />
      <Route path="/student/kanban" element={
        <PrivateRoute roles={['student']}>
          <StudentKanban />
        </PrivateRoute>
      } />
      <Route path="/student/livrables" element={
        <PrivateRoute roles={['student']}>
          <StudentLivrables />
        </PrivateRoute>
      } />
      <Route path="/student/notes" element={
        <PrivateRoute roles={['student']}>
          <StudentNotes />
        </PrivateRoute>
      } />
      <Route path="/student/chat" element={
        <PrivateRoute roles={['student']}>
          <StudentChat />
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
