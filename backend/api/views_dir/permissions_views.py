from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers.emp_dep_serializer import PermissionsSerializer

class PermissionsList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            can_manage_employees = request.user.has_perm('api.crud_employee')
            serializer = PermissionsSerializer({"can_manage_employees": can_manage_employees})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
