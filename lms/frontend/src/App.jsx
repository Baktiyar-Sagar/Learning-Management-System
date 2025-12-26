import React from 'react';
import { AuthProvider } from './pages/auth/AuthContext';
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <AuthProvider>
      <AppRoutes></AppRoutes>
    </AuthProvider>
  );
}

export default App;