import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, DollarSign, User, BookOpen, FileText, MessageCircle, Play, Plus, Edit, Trash2 } from 'lucide-react';
import { courseApi } from '../../api/courseApi';
import { useAuth } from '../auth/AuthContext';
import Loader from '../../components/Loader';
import LessonForm from './LessonForm';
import MaterialForm from './MaterialForm';
import EditLessonForm from './EditLessonForm';
import EditMaterialForm from './EditMaterialForm';
import EditCourseForm from './EditCourseForm';

const CourseDetails = ({ courseId, onBack }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showEditCourseForm, setShowEditCourseForm] = useState(false);

  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  const loadCourseDetails = async () => {
    setLoading(true);
    try {
      const coursesData = await courseApi.getCourses();
      const foundCourse = (coursesData.results || coursesData).find(c => c.id === courseId);
      setCourse(foundCourse);

      // Loading lessons
      try {
        const lessonsData = await courseApi.getLessons(courseId);
        setLessons(lessonsData);
      } catch (error) {
        console.log('No lessons yet');
      }

      // Loading materials
      try {
        const materialsData = await courseApi.getMaterials(courseId);
        setMaterials(materialsData);
      } catch (error) {
        console.log('No materials yet');
      }

      // Check if enrolled (for students)
      if (user?.role === 'student') {
        try {
          const enrollments = await courseApi.getEnrollments();
          const enrolled = enrollments.some(e => e.course === courseId);
          setIsEnrolled(enrolled);
        } catch (error) {
          console.log('Could not check enrollment status');
        }
      }
    } catch (error) {
      console.error('Failed to load course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    try {
      await courseApi.createEnrollment({
        course: courseId,
        price: course.price
      });
      alert('Enrolled successfully!');
      setIsEnrolled(true);
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        'Enrollment failed. You may already be enrolled.';
      alert(errorMessage);
    }
  };

  const handleLessonCreated = () => {
    setShowLessonForm(false);
    loadCourseDetails();
  };

  const handleMaterialCreated = () => {
    setShowMaterialForm(false);
    loadCourseDetails();
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await courseApi.deleteLesson(courseId, lessonId);
      alert('Lesson deleted successfully!');
      loadCourseDetails();
    } catch (error) {
      alert('Failed to delete lesson');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await courseApi.deleteMaterial(courseId, materialId);
      alert('Material deleted successfully!');
      loadCourseDetails();
    } catch (error) {
      alert('Failed to delete material');
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

    try {
      await courseApi.deleteCourse(courseId);
      alert('Course deleted successfully!');
      onBack();
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setShowLessonForm(false);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setShowMaterialForm(false);
  };

  const handleLessonUpdated = () => {
    setEditingLesson(null);
    loadCourseDetails();
  };

  const handleMaterialUpdated = () => {
    setEditingMaterial(null);
    loadCourseDetails();
  };

  const handleCourseUpdated = () => {
    setShowEditCourseForm(false);
    loadCourseDetails();
  };

  const isInstructor = user?.role === 'teacher' && course?.instructor === user?.id;
  const isAdmin = user?.role === 'admin';

  if (loading) return <Loader />;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Courses</span>
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{course.instructor_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.category_title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-2xl font-bold">${course.price}</span>
                </div>
              </div>
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setShowEditCourseForm(!showEditCourseForm)}
                  className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDeleteCourse}
                  className="flex items-center space-x-1 bg-red-500/80 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enroll Button for Students */}
        {user?.role === 'student' && (
          <div className="p-6 bg-gray-50 border-t">
            {isEnrolled ? (
              <div className="bg-green-50 text-green-700 px-6 py-3 rounded-lg text-center font-medium">
                ✓ You are enrolled in this course
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-lg"
              >
                Enroll Now - ${course.price}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Course Form */}
      {showEditCourseForm && isAdmin && (
        <EditCourseForm course={course} onSuccess={handleCourseUpdated} onCancel={() => setShowEditCourseForm(false)}
        />
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'lessons'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Lessons ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'materials'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Materials ({materials.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Course Duration</h3>
                  <p className="text-blue-700">{course.duration} hours of content</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Instructor</h3>
                  <p className="text-green-700">{course.instructor_name}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Category</h3>
                  <p className="text-purple-700">{course.category_title}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">Price</h3>
                  <p className="text-orange-700 text-xl font-bold">${course.price}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Course Lessons</h2>
                {isInstructor && (
                  <button
                    onClick={() => setShowLessonForm(!showLessonForm)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{showLessonForm ? 'Cancel' : 'Add Lesson'}</span>
                  </button>
                )}
              </div>

              {showLessonForm && (
                <LessonForm courseId={courseId} onSuccess={handleLessonCreated} onCancel={() => setShowLessonForm(false)}/>
              )}

              {editingLesson && (
                <EditLessonForm courseId={courseId} lesson={editingLesson} onSuccess={handleLessonUpdated} onCancel={()=>setEditingLesson(null)}/>
              )}

              {
                !isEnrolled && user.role === "student" ? (
                  <div className="text-center py-12 text-red-500 font-medium">
                    You must enroll in this course to view lessons
                  </div>
                )
                  : lessons.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Play className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No lessons available yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                              {lesson.video && (
                                <div className="mt-2">
                                  <span className="text-blue-600 text-sm flex items-center space-x-1">
                                    <Play className="w-4 h-4" />
                                    <span>Video Available</span>
                                  </span>
                                </div>
                              )}
                            </div>
                            {isInstructor && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditLesson(lesson)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit lesson"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete lesson"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Course Materials</h2>
                {isInstructor && (
                  <button
                    onClick={() => setShowMaterialForm(!showMaterialForm)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{showMaterialForm ? 'Cancel' : 'Add Material'}</span>
                  </button>
                )}
              </div>

              {showMaterialForm && (
                <MaterialForm
                  courseId={courseId}
                  onSuccess={handleMaterialCreated}
                  onCancel={() => setShowMaterialForm(false)}
                />
              )}

              {editingMaterial && (
                <EditMaterialForm
                  courseId={courseId}
                  material={editingMaterial}
                  onSuccess={handleMaterialUpdated}
                  onCancel={() => setEditingMaterial(null)}
                />
              )}

              {
                !isEnrolled && user.role === "student" ? (
                  <div className="text-center py-12 text-red-500 font-medium">
                    You must enroll in this course to view materials
                  </div>
                )
                  : materials.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No materials available yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {materials.map((material) => (
                        <div
                          key={material.id}
                          className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <FileText className="w-6 h-6 text-blue-600 flex shrink-0 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{material.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{material.description}</p>
                              {material.file && (
                                <a
                                  href={material.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                >
                                  Download File →
                                </a>
                              )}
                            </div>
                            {isInstructor && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditMaterial(material)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit material"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMaterial(material.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete material"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;