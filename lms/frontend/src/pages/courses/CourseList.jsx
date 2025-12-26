import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { courseApi } from '../../api/courseApi';
import Loader from '../../components/Loader';
import AdminCourseForm from './AdminCoursesForm';
import CourseDetails from './CourseDetails';

const CourseList = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    loadCourses();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await courseApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadCourses = async (params = {}) => {
    setLoading(true);
    try {
      const data = await courseApi.getCourses(params);
      setCourses(data.results || data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    loadCourses(params);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEnroll = async (courseId, price) => {
    try {
      await courseApi.createEnrollment({
        course: courseId,
        price: price
      });
      alert('🎉 Enrolled successfully! Check your enrollments page.');
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.course?.[0] ||
        'Enrollment failed. You may already be enrolled.';
      alert(errorMessage);
      console.error('Enrollment error:', error.response?.data);
    }
  };

  const handleCourseCreated = () => {
    setShowCreateForm(false);
    loadCourses();
  };

  const handleViewDetails = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
  };

  // If viewing course details, show details page
  if (selectedCourseId) {
    return <CourseDetails courseId={selectedCourseId} onBack={handleBackToCourses} />;
  }

  if (loading && courses.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>{showCreateForm ? 'Cancel' : 'Create Course'}</span>
          </button>
        )}
      </div>

      {showCreateForm && user?.role === 'admin' && (
        <AdminCourseForm
          onSuccess={handleCourseCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              {/* Query Search bar */}
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          {/* Category select */}
          <div className="flex space-x-2">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </div>
      {/* All the courses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col">

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Instructor:</span>
                  <span className="font-medium">{course.instructor_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{course.category_title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{course.duration}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-bold text-blue-600">${course.price}</span>
                </div>
              </div>

              <div className="mt-auto space-y-2">
                {user?.role === 'student' && (
                  <>
                    <button
                      onClick={() => handleViewDetails(course.id)}
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleEnroll(course.id, course.price)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Enroll Now
                    </button>
                  </>
                )}

                {(user?.role === 'teacher' || user?.role === 'admin') && (
                  <button
                    onClick={() => handleViewDetails(course.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* No courses */}
      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;