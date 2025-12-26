import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Award, GraduationCap, Eye } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import CourseStudentsModal from '../../components/CourseStudentsModal';

const AdminDashboard = () => {
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
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Complete system overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Courses"
          value={stats?.total_courses || 0}
          icon={BookOpen}
          color="bg-green-500"
        />
        <StatCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={GraduationCap}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Enrollments"
          value={stats?.total_enrollments || 0}
          icon={Award}
          color="bg-orange-500"
        />
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">User Role Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.total_students || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Students</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {stats?.total_teachers || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Instructors</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {stats?.total_admins || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Admins</p>
          </div>
        </div>
      </div>

      {/* Instructors List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Instructors Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Instructor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Courses
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.instructors?.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {instructor.username}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {instructor.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {instructor.total_courses}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats?.instructors || stats.instructors.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No instructors found
            </div>
          )}
        </div>
      </div>

      {/* Courses with Enrollment Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Courses & Enrollment Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Instructor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Enrolled Students
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.courses?.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {course.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {course.instructor_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {course.category}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      {course.enrolled_students}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">
                    ${course.price}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {course.enrolled_students > 0 ? (
                      <button
                        onClick={() => handleViewStudents(course)}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Students</span>
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">No students</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats?.courses || stats.courses.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No courses found
            </div>
          )}
        </div>
      </div>

      {/* Students Modal */}
      {selectedCourse && (
        <CourseStudentsModal
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;