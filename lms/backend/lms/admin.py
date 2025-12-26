from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *




# Category
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title',)

# Course
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'category', 'price', 'duration', 'is_active', 'created_at')
    list_filter = ('category', 'instructor', 'is_active', 'created_at')
    search_fields = ('title', 'description')
    raw_id_fields = ('instructor', 'category')  # Better performance on large tables

# Lesson
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'created_at', 'updated_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'description')
    raw_id_fields = ('course',)

# Material
@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'created_at', 'updated_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'description')
    raw_id_fields = ('course',)

# Enrollment
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'is_active', 'progress', 'is_completed', 'price')
    list_filter = ('is_active', 'is_completed', 'course')
    search_fields = ('student__username', 'course__title')
    raw_id_fields = ('student', 'course')

# QuestionAnswer 
@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('user__username', 'lesson__title', 'description')
    raw_id_fields = ('user', 'lesson')
