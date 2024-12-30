from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models_dir.records_models import LeaveType
from ..serializers.records_serializer import LeaveTypeSerializer
from django.contrib.auth.decorators import permission_required

class LeaveTypeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            leave_types = LeaveType.objects.all()
            serializer = LeaveTypeSerializer(leave_types, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

# @permission_required(raise_exception=True)
class LeaveTypeCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LeaveTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Leave type created successfully", "data": serializer.data}, status=201)
        return Response({"message": "Failed to create leave type", "errors": serializer.errors}, status=400)
    

# @permission_required(raise_exception=True)
class LeaveTypeDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        try:
            leave_type = LeaveType.objects.get(pk=pk)
            leave_type.delete()
            return Response({"message": "Leave type deleted successfully"}, status=204)
        except LeaveType.DoesNotExist:
            return Response({"error": "Leave type not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class LeaveTypeEditView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, leave_id):
        try:
            leave_type = LeaveType.objects.get(leave_id=leave_id)
            print(leave_type)
        except LeaveType.DoesNotExist:
            return Response({"error": "Leave type not found"}, status=404)
        
        serializer = LeaveTypeSerializer(leave_type, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        
        return Response(serializer.errors, status=400)