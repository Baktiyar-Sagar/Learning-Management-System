from django.shortcuts import render
from . import models, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers


@api_view(['GET', 'POST'])
def lesson_list_create(request, course_id):
    try:
        course = models.Course.objects.get(id=course_id)
    except models.Course.DoesNotExist:
        return Response(
            {'detail': 'Course not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        lessons = models.Lesson.objects.filter(course_id=course_id)
        serializer = serializers.LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated or request.user.role != 'teacher':
            return Response(
                {'detail': 'Only teachers can create lessons'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if user is the course instructor
        if course.instructor != request.user:
            return Response(
                {'detail': 'Only the course instructor can add lessons'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = serializers.LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'POST'])
def category_list_create(request):
    if request.method == 'GET':
        categories = models.Category.objects.filter(is_active=True)
        serializer = serializers.CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'detail':'Only teachers can create categories'}, status=status.HTTP_403_FORBIDDEN)
        serializer = serializers.CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'POST'])
def course_list_create(request):
    if request.method == 'GET':
        # category, search
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        queryset = models.Course.objects.all()

        # Filter by category ID instead of name
        if category:
            queryset = queryset.filter(category_id=category)

        # Use icontains instead of incontains
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Filter based on user role
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                # Teachers only see their own courses
                queryset = queryset.filter(instructor=request.user)
            # Admin and students see all courses
        
        queryset = queryset.select_related('instructor', 'category')

        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        serializer = serializers.CourseSerializer(
            paginated_queryset,
            many=True,
            context={'request': request}
        )
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'POST':
        # Only admins can create courses
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(
                {'detail': 'Only admins can create courses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = serializers.CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def material_list_create(request, course_id):
    try:
        course = models.Course.objects.get(id=course_id)
    except models.Course.DoesNotExist:
        return Response(
            {'detail': 'Course not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        materials = models.Material.objects.filter(course_id=course_id)
        serializer = serializers.MaterialSerializer(materials, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated or request.user.role != 'teacher':
            return Response(
                {'detail': 'Only teachers can upload materials'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if user is the course instructor
        if course.instructor != request.user:
            return Response(
                {'detail': 'Only the course instructor can add materials'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = serializers.MaterialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def enrollment_list_create(request):
    if not request.user.is_authenticated or request.user.role != 'student':
        return Response(
            {'detail': 'Only students can access enrollments'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        enrollments = models.Enrollment.objects.filter(student=request.user)
        serializer = serializers.EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check if already enrolled
        course_id = request.data.get('course')
        if models.Enrollment.objects.filter(student=request.user, course_id=course_id).exists():
            return Response(
                {'detail': 'You are already enrolled in this course'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = serializers.EnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def question_answer_list_create(request, lesson_id):
    if request.method == 'GET':
        questions = models.QuestionAnswer.objects.filter(
            lesson_id=lesson_id,
            is_active=True
        )
        serializer = serializers.QuestionAnswerSerializer(questions, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = serializers.QuestionAnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, lesson_id=lesson_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_students(request, course_id):
    try:
        course = models.Course.objects.get(id=course_id)
    except models.Course.DoesNotExist:
        return Response(
            {'detail': 'Course not found'}, status=status.HTTP_404_NOT_FOUND
        )
    
    # Permission check
    if request.user.role == 'teacher' and course.instructor != request.user:
        return Response(
            {'detail': 'You can only view students from your own courses'},status=status.HTTP_403_FORBIDDEN
            )
    
    if request.user.role not in ['admin', 'teacher']:
        return Response(
            {'detail': 'Only admins and teachers can view course students'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all enrollments for this course
    enrollments = models.Enrollment.objects.filter(
        course=course,
        is_active=True
    ).select_related('student')
    
    students_data = []
    for enrollment in enrollments:
        students_data.append({
            'id': enrollment.id,
            'student_id': enrollment.student.id,
            'student_name': enrollment.student.username,
            'student_email': enrollment.student.email,
            'student_first_name': enrollment.student.first_name,
            'student_last_name': enrollment.student.last_name,
            'progress': enrollment.progress,
            'is_completed': enrollment.is_completed,
            'total_mark': enrollment.total_mark,
            'price_paid': enrollment.price,
            'enrolled_date': enrollment.created_at if hasattr(enrollment, 'created_at') else None,
            'is_certificate_ready': enrollment.is_certificate_ready
        })
    
    response_data = {
        'course_id': course.id,
        'course_title': course.title,
        'instructor_name': course.instructor.username,
        'total_students': len(students_data),
        'students': students_data
    }
    
    return Response(response_data)

# Course Detail, Update, Delete
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_detail(request, pk):
    try:
        course = models.Course.objects.get(pk=pk)
    except models.Course.DoesNotExist:
        return Response(
            {'detail': 'Course not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = serializers.CourseSerializer(course, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Only admin can update courses
        if request.user.role != 'admin':
            return Response(
                {'detail': 'Only admins can update courses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = serializers.CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only admin can delete courses
        if request.user.role != 'admin':
            return Response(
                {'detail': 'Only admins can delete courses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        course.delete()
        return Response(
            {'detail': 'Course deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# Lesson Detail, Update, Delete
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def lesson_detail(request, course_id, pk):
    try:
        lesson = models.Lesson.objects.get(pk=pk, course_id=course_id)
    except models.Lesson.DoesNotExist:
        return Response(
            {'detail': 'Lesson not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if user is the course instructor
    if request.user.role == 'teacher' and lesson.course.instructor != request.user:
        return Response(
            {'detail': 'You can only manage lessons from your own courses'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        serializer = serializers.LessonSerializer(lesson)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Only instructors can update lessons
        if request.user.role != 'teacher':
            return Response(
                {'detail': 'Only instructors can update lessons'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = serializers.LessonSerializer(lesson, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only instructors can delete lessons
        if request.user.role != 'teacher':
            return Response(
                {'detail': 'Only instructors can delete lessons'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        lesson.delete()
        return Response(
            {'detail': 'Lesson deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# Material Detail, Update, Delete
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def material_detail(request, course_id, pk):
    try:
        material = models.Material.objects.get(pk=pk, course_id=course_id)
    except models.Material.DoesNotExist:
        return Response(
            {'detail': 'Material not found'}, status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if user is the course instructor
    if request.user.role == 'teacher' and material.course.instructor != request.user:
        return Response(
            {'detail': 'You can only manage materials from your own courses'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        serializer = serializers.MaterialSerializer(material)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Only instructors can update materials
        if request.user.role != 'teacher':
            return Response(
                {'detail': 'Only instructors can update materials'}, status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = serializers.MaterialSerializer(material, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only instructors can delete materials
        if request.user.role != 'teacher':
            return Response(
                {'detail': 'Only instructors can delete materials'},status=status.HTTP_403_FORBIDDEN)
        
        material.delete()
        return Response({'detail': 'Material deleted successfully'}, status=status.HTTP_204_NO_CONTENT)