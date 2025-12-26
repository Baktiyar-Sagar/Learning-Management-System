import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Eye } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import CourseStudentsModal from '../../components/CourseStudentsModal';

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await dashboardApi.getSummary();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h2>
        <p className="text-gray-600 mt-1">Your teaching overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="My Courses"
          value={stats?.total_courses || 0}
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Students Enrolled"
          value={stats?.total_students_enrolled || 0}
          icon={Users}
          color="bg-green-500"
        />
      </div>

      {/* My Courses with Enrollment Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">My Courses</h3>
        
        {stats?.courses && stats.courses.length > 0 ? (
          <div className="space-y-4">
            {stats.courses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {course.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.category || 'No category'}
                      </span>
                      <span>Duration: {course.duration}h</span>
                      <span className="font-medium text-blue-600">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                        <p className="text-2xl font-bold">
                          {course.enrolled_students}
                        </p>
                        <p className="text-xs">Students</p>
                      </div>
                    </div>
                    {course.enrolled_students > 0 && (
                      <button
                        onClick={() => handleViewStudents(course)}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        title="View all students"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No courses assigned yet</p>
            <p className="text-sm mt-2">
              Contact admin to get courses assigned to you
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Teaching Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold">{stats?.total_courses || 0}</p>
            <p className="text-blue-100">Active Courses</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {stats?.total_students_enrolled || 0}
            </p>
            <p className="text-blue-100">Total Students</p>
          </div>
        </div>
      </div>

      {/* Students Modal */}
      {selectedCourse && (
        <CourseStudentsModal courseId={selectedCourse.id} courseTitle={selectedCourse.title} onClose={handleCloseModal}/>
      )}
    </div>
  );
};

export default InstructorDashboard;