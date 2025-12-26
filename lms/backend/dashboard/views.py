from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import User
from lms.models import Course, Enrollment
from lms.serializers import CourseSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    
    user = request.user
    
    if user.role == 'admin':
        # Admin Dashboard - Full system overview
        total_users = User.objects.count()
        total_students = User.objects.filter(role='student').count()
        total_teachers = User.objects.filter(role='teacher').count()
        total_admins = User.objects.filter(role='admin').count()
        total_courses = Course.objects.filter(is_active=True).count()
        total_enrollments = Enrollment.objects.filter(is_active=True).count()
        
        # Course Instructor mapping with enrollment counts
        courses_data = []
        courses = Course.objects.filter(is_active=True).select_related('instructor')
        for course in courses:
            enrollment_count = Enrollment.objects.filter(
                course=course, 
                is_active=True
            ).count()
            courses_data.append({
                'id': course.id,
                'title': course.title,
                'instructor_name': course.instructor.username,
                'instructor_id': course.instructor.id,
                'enrolled_students': enrollment_count,
                'price': course.price,
                'duration': course.duration,
                'category': course.category.title if course.category else None
            })
        
        # Instructor list with course counts
        instructors_data = []
        instructors = User.objects.filter(role='teacher')
        for instructor in instructors:
            course_count = Course.objects.filter(
                instructor=instructor, 
                is_active=True
            ).count()
            instructors_data.append({
                'id': instructor.id,
                'username': instructor.username,
                'email': instructor.email,
                'total_courses': course_count
            })
        
        data = {
            'role': 'admin',
            'total_users': total_users,
            'total_students': total_students,
            'total_teachers': total_teachers,
            'total_admins': total_admins,
            'total_courses': total_courses,
            'total_enrollments': total_enrollments,
            'courses': courses_data,
            'instructors': instructors_data
        }
        
    elif user.role == 'teacher':
        # Instructor Dashboard - Only their courses
        my_courses = Course.objects.filter(
            instructor=user, 
            is_active=True
        ).select_related('category')
        
        total_my_courses = my_courses.count()
        total_students_enrolled = 0
        
        courses_data = []
        for course in my_courses:
            enrollment_count = Enrollment.objects.filter(
                course=course, 
                is_active=True
            ).count()
            total_students_enrolled += enrollment_count
            
            courses_data.append({
                'id': course.id,
                'title': course.title,
                'enrolled_students': enrollment_count,
                'price': course.price,
                'duration': course.duration,
                'category': course.category.title if course.category else None
            })
        
        data = {
            'role': 'teacher',
            'total_courses': total_my_courses,
            'total_students_enrolled': total_students_enrolled,
            'courses': courses_data
        }
        
    elif user.role == 'student':
        # Student Dashboard - Only their enrollments
        my_enrollments = Enrollment.objects.filter(
            student=user,
            is_active=True
        ).select_related('course', 'course__instructor')
        
        total_enrolled = my_enrollments.count()
        completed_courses = my_enrollments.filter(is_completed=True).count()
        in_progress = total_enrolled - completed_courses
        
        # Calculating average progress
        if total_enrolled > 0:
            avg_progress = sum([e.progress for e in my_enrollments]) / total_enrolled
        else:
            avg_progress = 0
        
        enrollments_data = []
        for enrollment in my_enrollments:
            enrollments_data.append({
                'id': enrollment.id,
                'course_id': enrollment.course.id,
                'course_title': enrollment.course.title,
                'instructor_name': enrollment.course.instructor.username,
                'progress': enrollment.progress,
                'is_completed': enrollment.is_completed,
                'price': enrollment.price
            })
        
        data = {
            'role': 'student',
            'total_enrolled': total_enrolled,
            'completed_courses': completed_courses,
            'in_progress': in_progress,
            'average_progress': round(avg_progress, 2),
            'enrollments': enrollments_data
        }
    
    else:
        data = {'detail': 'Invalid role'}
    
    return Response(data)