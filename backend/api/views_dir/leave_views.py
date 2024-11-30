from rest_framework.views import APIView
from rest_framework.response import Response
from ..models_dir.records_models import LeaveType
from ..serializers.records_serializer import LeaveTypeSerializer

class LeaveTypeListView(APIView):
    def get(self, request):
        try:
            leave_types = LeaveType.objects.all()
            serializer = LeaveTypeSerializer(leave_types, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
