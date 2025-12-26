import React, { useState, useEffect } from 'react';
import { X, User, Mail, Award, TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../api/axios';
import Loader from './Loader';

const CourseStudentsModal = ({ courseId, courseTitle, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, [courseId]);

  const loadStudents = async () => {
    try {
      const response = await axiosInstance.get(`/lms/courses/${courseId}/students/`);
      setStudents(response.data.students || []);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-l-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Enrolled Students</h2>
            <p className="text-blue-800 font-semibold mt-1 bg-blue-300 py-2 px-4 rounded-xl">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No students enrolled yet</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enrolled Students</p>
                    <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {students.filter(s => s.is_completed).length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {students.filter(s => !s.is_completed).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Progress
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Marks
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {student.student_first_name || student.student_name}
                                {student.student_last_name && ` ${student.student_last_name}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                @{student.student_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{student.student_email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className={`font-semibold ${getProgressTextColor(student.progress)}`}>
                                {student.progress}%
                              </span>
                            </div>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {student.is_completed ? (
                            <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              <span>In Progress</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold text-gray-900">
                              {student.total_mark}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-blue-600">
                            ${student.price_paid}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Statistics */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Avg Progress</p>
                  <p className="text-2xl font-bold text-green-700">
                    {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Avg Marks</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {(students.reduce((acc, s) => acc + s.total_mark, 0) / students.length).toFixed(1)}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ${students.reduce((acc, s) => acc + s.price_paid, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {Math.round((students.filter(s => s.is_completed).length / students.length) * 100)}%
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseStudentsModal;