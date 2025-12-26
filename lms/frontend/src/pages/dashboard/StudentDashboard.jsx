import React, { useState, useEffect } from 'react';
import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Learning Dashboard</h2>
        <p className="text-gray-600 mt-1">Track your learning progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Courses"
          value={stats?.total_enrolled || 0}
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={stats?.completed_courses || 0}
          icon={Award}
          color="bg-green-500"
        />
        <StatCard
          title="In Progress"
          value={stats?.in_progress || 0}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="Avg Progress"
          value={`${stats?.average_progress || 0}%`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      {/* My Enrollments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">My Courses</h3>
        
        {stats?.enrollments && stats.enrollments.length > 0 ? (
          <div className="space-y-4">
            {stats.enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {enrollment.course_title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Instructor: {enrollment.instructor_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enrollment.is_completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {enrollment.is_completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium text-gray-900">
                      {enrollment.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        enrollment.is_completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-blue-600">${enrollment.price}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No enrolled courses yet</p>
            <p className="text-sm mt-2">
              Browse available courses and start learning today!
            </p>
          </div>
        )}
      </div>

      {/* Learning Progress Summary */}
      {stats?.total_enrolled > 0 && (
        <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Your Learning Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-3xl font-bold">{stats.total_enrolled}</p>
              <p className="text-blue-100 text-sm">Total Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.completed_courses}</p>
              <p className="text-blue-100 text-sm">Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.in_progress}</p>
              <p className="text-blue-100 text-sm">Ongoing</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.average_progress}%</p>
              <p className="text-blue-100 text-sm">Avg Progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;