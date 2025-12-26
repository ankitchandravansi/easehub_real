import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PGListingPage from './pages/PGListingPage';
import MealServicesPage from './pages/MealServicesPage';
import LaundryServicesPage from './pages/LaundryServicesPage';
import ExtraServicesPage from './pages/ExtraServicesPage';
import UserDashboard from './pages/UserDashboard';
import RequestsPage from './pages/RequestsPage';
import BookingPage from './pages/BookingPage.jsx'; // Explicit extension to avoid misses
import BookingSuccessPage from './pages/BookingSuccessPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminPGList from './pages/admin/AdminPGList.jsx';
import AdminPGForm from './pages/admin/AdminPGForm.jsx';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />


              {/* Service Pages */}
              <Route path="/services/pg" element={<PGListingPage />} />
              <Route path="/services/meals" element={<MealServicesPage />} />
              <Route path="/services/laundry" element={<LaundryServicesPage />} />
              <Route path="/services/extra" element={<ExtraServicesPage />} />

              {/* Protected routes */}
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <RequestsPage />
                  </ProtectedRoute>
                }
              />

              {/* Booking Routes */}
              <Route
                path="/book/:id"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-success"
                element={
                  <ProtectedRoute>
                    <BookingSuccessPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="pgs" element={<AdminPGList />} />
                      <Route path="pgs/add" element={<AdminPGForm />} />
                      <Route path="pgs/edit/:id" element={<AdminPGForm />} />
                      <Route path="*" element={<AdminDashboard />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
