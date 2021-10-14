from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .serializers import CustomUserSerializer


class CustomUserCreate(APIView):
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # calls create automatically
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class HelloWorld(APIView):

    def get(self, request):
        return Response(data={'message': 'hello world!'}, status=status.HTTP_200_OK)
