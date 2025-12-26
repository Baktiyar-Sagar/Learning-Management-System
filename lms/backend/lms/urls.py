from django.urls import path
from . import views 

urlpatterns = [
    # Categories
    path('categories/', views.category_list_create, name='category-list-create'),
    # Courses
    path('courses/', views.course_list_create, name='course-list-create'),
    path('courses/<int:pk>/', views.course_detail, name='course-detail'), 
    # Course Students
    path('courses/<int:course_id>/students/', views.course_students, name='course-students'),
    # Lessons
    path('courses/<int:course_id>/lessons/', views.lesson_list_create, name='lesson-list-create'),
    path('courses/<int:course_id>/lessons/<int:pk>/', views.lesson_detail, name='lesson-detail'), 
    # Materials
    path('courses/<int:course_id>/materials/', views.material_list_create, name='material-list-create'),
    path('courses/<int:course_id>/materials/<int:pk>/', views.material_detail, name='material-detail'), 
    # Enrollments 
    path('enrollments/', views.enrollment_list_create, name='enrollment-list-create'),
    # Question & Answers 
    path('lessons/<int:lesson_id>/questions/', views.question_answer_list_create, name='question-answer-list-create'),
]