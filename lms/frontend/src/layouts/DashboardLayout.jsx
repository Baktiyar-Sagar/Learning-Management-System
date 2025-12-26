import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../pages/dashboard/Dashboard';
import CourseList from '../pages/courses/CourseList';
import Enrollments from '../pages/courses/Enrollments';
import Profile from '../pages/profile/Profile';
import CategoryManagement from '../pages/courses/CategoryManagement';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'courses':
        return <CourseList />
      case 'enrollments':
        return <Enrollments />
      case 'categories':
        return <CategoryManagement />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard />
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;