import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Prospects from './pages/Prospects';
import ProspectDetail from './pages/ProspectDetail';
import EditProspect from './pages/EditProspect';
import NewVisit from './pages/NewVisit';
import Planning from './pages/Planning';
import NewTour from './pages/NewTour';
import Reports from './pages/Reports';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import MapView from './pages/MapView';
import Users from './pages/Users';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Navigate to="/dashboard" />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/prospects"
        element={
          <PrivateRoute>
            <Layout>
              <Prospects />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/prospects/:id"
        element={
          <PrivateRoute>
            <Layout>
              <ProspectDetail />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/prospects/:id/edit"
        element={
          <PrivateRoute>
            <Layout>
              <EditProspect />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/prospects/:id/new-visit"
        element={
          <PrivateRoute>
            <Layout>
              <NewVisit />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/planning/new"
        element={
          <PrivateRoute>
            <Layout>
              <NewTour />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/planning"
        element={
          <PrivateRoute>
            <Layout>
              <Planning />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Layout>
              <Reports />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/stats"
        element={
          <PrivateRoute>
            <Layout>
              <Stats />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/map"
        element={
          <PrivateRoute>
            <Layout>
              <MapView />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Layout>
              <Users />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

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
