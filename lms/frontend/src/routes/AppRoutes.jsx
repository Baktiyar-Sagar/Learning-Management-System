import React, { useState } from 'react';
import { useAuth } from '../pages/auth/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import Loader from '../components/Loader';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// const AppRoutes = () => {
//   const { user, loading } = useAuth();
//   const [showLogin, setShowLogin] = useState(true);
//   const [resetParams, setResetParams] = useState(null);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <Loader />
//       </div>
//     );
//   }

//   if (!user) {
//     return showLogin ? (
//       <Login onSwitchToRegister={() => setShowLogin(false)} />
//     ) : (
//       <Register onSwitchToLogin={() => setShowLogin(true)} />
//     );
//   }

//   return <DashboardLayout />;
// };

// export default AppRoutes;


const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [resetParams, setResetParams] = useState(null);

  // Check URL for reset password link
  React.useEffect(() => {
    const path = window.location.pathname;
    const resetMatch = path.match(/\/reset-password\/([^\/]+)\/([^\/]+)/);
    if (resetMatch) {
      setResetParams({
        uidb64: resetMatch[1],
        token: resetMatch[2]
      });
      setCurrentPage('reset');
    }
  }, []);

  const handlePageSwitch = (page) => {
    setCurrentPage(page);
    if (page === 'login') {
      window.history.pushState({}, '', '/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader />
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'forgot') {
      return <ForgotPassword onBack={() => handlePageSwitch('login')} />;
    }
    
    if (currentPage === 'reset' && resetParams) {
      return (
        <ResetPassword
          uidb64={resetParams.uidb64}
          token={resetParams.token}
          onSuccess={() => handlePageSwitch('login')}
        />
      );
    }
    
    if (currentPage === 'register') {
      return <Register onSwitchToLogin={() => handlePageSwitch('login')} />;
    }
    
    return <Login onSwitchToRegister={handlePageSwitch} />;
  }

  return <DashboardLayout />;
};

export default AppRoutes;