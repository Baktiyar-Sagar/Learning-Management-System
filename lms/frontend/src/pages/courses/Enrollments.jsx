import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Eye } from 'lucide-react';
import { courseApi } from '../../api/courseApi';
import Loader from '../../components/Loader';
import CourseDetails from './CourseDetails';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const data = await courseApi.getEnrollments();
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleBackToEnrollments = () => {
    setSelectedCourseId(null);
  };

  // If viewing course details, show details page
  if (selectedCourseId) {
    return <CourseDetails courseId={selectedCourseId} onBack={handleBackToEnrollments} />;
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Enrollments</h2>
        <p className="text-gray-600 mt-1">
          Track your learning progress
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">
            You haven't enrolled in any courses yet
          </p>
          <p className="text-gray-400 mt-2">
            Browse courses to get started with your learning journey
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {enrollment.course_title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Student: {enrollment.student_name}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Price Paid</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${enrollment.price}
                    </p>
                  </div>
                  {enrollment.is_completed ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <Clock className="w-8 h-8 text-orange-500" />
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Progress:</span>
                  <span className="font-medium text-gray-800">
                    {enrollment.progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`font-medium ${enrollment.is_completed
                        ? 'text-green-600'
                        : 'text-orange-600'
                        }`}
                    >
                      {enrollment.is_completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Mark:</span>
                    <span className="font-medium text-gray-800">
                      {enrollment.total_mark}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewCourse(enrollment.course)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  <Eye className="w-5 h-5" />View Course Details
                </button>

                {enrollment.is_certificate_ready && (
                  <div className="mt-4 pt-4 border-t">
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      Download Certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enrollments;

