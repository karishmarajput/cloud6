import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AuthenticatedAdminRoute from './AuthenticatedAdminRoute';
import OgLogin from './pages/organisation/OgLogin';
import OgRegister from './pages/organisation/OgRegister';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="ogLogin" element={<OgLogin />} />
          <Route path="OgRegister" element={<OgRegister />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="admin-dashboard" element={<AuthenticatedAdminRoute/>}/>
          {/* Use AuthenticatedAdminRoute for the admin-dashboard */}
          {/* <AuthenticatedAdminRoute path="admin-dashboard" element={<AdminDashboard />} /> */}
          {/* Additional Routes can be added here */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
