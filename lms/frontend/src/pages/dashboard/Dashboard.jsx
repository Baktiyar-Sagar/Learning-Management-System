import React from 'react';
import { useAuth } from '../auth/AuthContext'
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Rendering role-specific dashboard
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'teacher') {
    return <InstructorDashboard />;
  } else if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-500">Invalid user role</p>
    </div>
  );
};

export default Dashboard;