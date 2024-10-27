from rest_framework import serializers
from django.contrib.auth import authenticate

class EmployeeLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid username or password.')
        
        attrs['user'] = user
        return attrs