import React from 'react';
import { Home, BookOpen, Award, User, X, Tag } from 'lucide-react';
import { useAuth } from '../pages/auth/AuthContext';

const Sidebar = ({ isOpen, closeSidebar, currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      roles: ['admin', 'teacher', 'student'],
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      roles: ['admin', 'teacher', 'student'],
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Tag,
      roles: ['admin'],
    },
    {
      id: 'enrollments',
      label: 'My Enrollments',
      icon: Award,
      roles: ['student'],
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      roles: ['admin', 'teacher', 'student'],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    closeSidebar();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">LMS Platform</h2>
            <button onClick={closeSidebar} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {filteredMenu.map((item) => (
            <button key={item.id} onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;