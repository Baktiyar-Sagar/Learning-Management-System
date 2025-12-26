import axiosInstance from './axios';

export const courseApi = {

  // Get all courses with filters
  getCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/lms/courses/?${queryString}`);
    return response.data;
  },

  // Get single course
  getCourse: async (id) => {
    const response = await axiosInstance.get(`/lms/courses/${id}/`);
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await axiosInstance.post('/lms/courses/', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const response = await axiosInstance.put(`/lms/courses/${id}/`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await axiosInstance.delete(`/lms/courses/${id}/`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await axiosInstance.get('/lms/categories/');
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post('/lms/categories/', categoryData);
    return response.data;
  },

  // Get enrollments
  getEnrollments: async () => {
    const response = await axiosInstance.get('/lms/enrollments/');
    return response.data;
  },

  // Create enrollment
  createEnrollment: async (enrollmentData) => {
    const response = await axiosInstance.post('/lms/enrollments/', enrollmentData);
    return response.data;
  },

  // Get lessons for a course
  getLessons: async (courseId) => {
    const response = await axiosInstance.get(`/lms/courses/${courseId}/lessons/`);
    return response.data;
  },

  // Create lesson
  createLesson: async (courseId, lessonData) => {
    const response = await axiosInstance.post(`/lms/courses/${courseId}/lessons/`, lessonData);
    return response.data;
  },

  // Update lesson
  updateLesson: async (courseId, lessonId, lessonData) => {
    const response = await axiosInstance.put(`/lms/courses/${courseId}/lessons/${lessonId}/`, lessonData);
    return response.data;
  },

  // Delete lesson
  deleteLesson: async (courseId, lessonId) => {
    const response = await axiosInstance.delete(`/lms/courses/${courseId}/lessons/${lessonId}/`);
    return response.data;
  },

  // Get materials for a course
  getMaterials: async (courseId) => {
    const response = await axiosInstance.get(`/lms/courses/${courseId}/materials/`);
    return response.data;
  },

  // Create material
  createMaterial: async (courseId, materialData) => {
    const response = await axiosInstance.post(`/lms/courses/${courseId}/materials/`, materialData);
    return response.data;
  },

  // Update material
  updateMaterial: async (courseId, materialId, materialData) => {
    const response = await axiosInstance.put(`/lms/courses/${courseId}/materials/${materialId}/`, materialData);
    return response.data;
  },

  // Delete material
  deleteMaterial: async (courseId, materialId) => {
    const response = await axiosInstance.delete(`/lms/courses/${courseId}/materials/${materialId}/`);
    return response.data;
  },

  // Get questions for a lesson
  getQuestions: async (lessonId) => {
    const response = await axiosInstance.get(`/lms/lessons/${lessonId}/questions/`);
    return response.data;
  },

  // Create question
  createQuestion: async (lessonId, questionData) => {
    const response = await axiosInstance.post(`/lms/lessons/${lessonId}/questions/`, questionData);
    return response.data;
  },
}

