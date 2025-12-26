from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, UserProfileSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

# Register 
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login 
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        serializer = UserProfileSerializer(user)
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



# Profile
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    
    if request.user.role == 'admin':
        users = User.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)
    else:
        return Response(
            {'detail': 'Only admins can view user list'},
            status=status.HTTP_403_FORBIDDEN
        )
    
# Forgot Password - Request Reset
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'detail': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            'detail': 'If an account exists with this email, you will receive a password reset link.'
        })
    
    # Generate token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Create reset link
    # For development, using localhost.
    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
    
    # Send email
    try:
        send_mail(
            subject='Password Reset Request - LMS',
            message=f'''
                        Hello {user.username},

                        You requested to reset your password. Click the link below to reset it:

                        {reset_link}

                        This link will expire in 15 minutes.

                        If you didn't request this, please ignore this email.

                        Best regards,
                        LMS Team
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error sending email: {e}")
        # For development, return the link if email fails
        return Response({
            'detail': 'Password reset email sent successfully',
            'reset_link': reset_link  # Remove this in production!
        })
    
    return Response({
        'detail': 'If an account exists with this email, you will receive a password reset link.'
    })


# Reset Password - Verify Token and Reset
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, uidb64, token):
    new_password = request.data.get('password')
    
    if not new_password:
        return Response(
            {'detail': 'New password is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(new_password) < 6:
        return Response(
            {'detail': 'Password must be at least 6 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Decode user ID
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(
            {'detail': 'Invalid reset link'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if token is valid
    if not default_token_generator.check_token(user, token):
        return Response(
            {'detail': 'Invalid or expired reset link'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Reset password
    user.set_password(new_password)
    user.save()
    
    return Response({
        'detail': 'Password has been reset successfully. You can now login with your new password.'
    })




# Verify Reset Token (optional - to check if token is still valid)
@api_view(['GET'])
@permission_classes([AllowAny])
def verify_reset_token(request, uidb64, token):

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        
        if default_token_generator.check_token(user, token):
            return Response({
                'valid': True,
                'username': user.username
            })
        else:
            return Response({
                'valid': False,
                'detail': 'Token has expired'
            }, status=status.HTTP_400_BAD_REQUEST)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({
            'valid': False,
            'detail': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)