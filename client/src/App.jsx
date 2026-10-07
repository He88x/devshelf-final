import SnippetsPage from './pages/SnippetsPage';
import { Routes, Route, Navigate } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ResourcesPage from './pages/ResourcesPage';
import TasksPage from './pages/TasksPage';

import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Protected application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/resources"
            element={<ResourcesPage />}
          />

         <Route
            path="/snippets"
            element={<SnippetsPage />}
          />

          <Route
            path="/tasks"
            element={<TasksPage />}
          />
        </Route>
      </Route>

      {/* Default route */}
      <Route
        path="/"
        element={<Navigate to="/resources" replace />}
      />

      {/* 404 route */}
      <Route
        path="*"
        element={<h1>404 - Page Not Found</h1>}
      />
    </Routes>
  );
}

export default App;