import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { ErrorBoundary } from '@/routes/ErrorBoundary';
import { AuthInitializer } from '@/components/AuthInitializer';
import { RoleRedirect } from '@/routes/RoleRedirect';
import { Toaster } from '@/components/ui/toaster';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AcceptInvitePage } from '@/pages/AcceptInvitePage';
import { CompanyDashboard } from '@/pages/CompanyDashboard';
import { TeamManagementPage } from '@/pages/TeamManagementPage';
import { ProjectsListPage } from '@/pages/ProjectsListPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { TaskDetailPage } from '@/pages/TaskDetailPage';
import { MyTasksPage } from '@/pages/MyTasksPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { HRIntegrationPage } from '@/pages/HRIntegrationPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <ErrorBoundary>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />

              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={
                  <ErrorBoundary>
                    <ProtectedRoute roles={['COMPANY_ADMIN', 'SUPER_ADMIN']}>
                      <CompanyDashboard />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/team" element={
                  <ErrorBoundary>
                    <ProtectedRoute roles={['COMPANY_ADMIN', 'SUPER_ADMIN']}>
                      <TeamManagementPage />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/projects" element={<ErrorBoundary><ProjectsListPage /></ErrorBoundary>} />
                <Route path="/projects/:id" element={<ErrorBoundary><ProjectDetailPage /></ErrorBoundary>} />
                <Route path="/projects/:id/tasks/:taskId" element={<ErrorBoundary><TaskDetailPage /></ErrorBoundary>} />
                <Route path="/my-tasks" element={<ErrorBoundary><MyTasksPage /></ErrorBoundary>} />
                <Route path="/reports" element={
                  <ErrorBoundary>
                    <ProtectedRoute roles={['COMPANY_ADMIN', 'SUPER_ADMIN']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/settings" element={
                  <ErrorBoundary>
                    <ProtectedRoute roles={['COMPANY_ADMIN', 'SUPER_ADMIN']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/settings/hr" element={
                  <ErrorBoundary>
                    <ProtectedRoute roles={['COMPANY_ADMIN', 'SUPER_ADMIN']}>
                      <HRIntegrationPage />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                {/* Root → smart redirect based on role */}
                <Route path="/" element={<RoleRedirect />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ErrorBoundary>
          <Toaster />
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
