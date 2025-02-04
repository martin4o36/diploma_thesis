import { useState, useEffect } from "react";
import api from "../../../../api";
import "../../../../styles/requests/PendingRequests.css"
import { Calendar, Users, Check, X } from "lucide-react";

function PendingHolidayRequests({ employee }) {
    const [pendingRequests, setPendingRequests] = useState([]);

    const fecthPendingRequests = async () => {
        const response = await api.get(`/api/request/${employee.employee_id}/holiday/pending/`);
        console.log(response.data);
        setPendingRequests(response.data);
    };

    useEffect(() => {
        fecthPendingRequests();
    }, []);

    const handleApproveDeclineRequest = async (requestId, isApproved) => {
        const status = isApproved ? "Approved" : "Rejected";
        try {
            await api.post(`/api/request/holiday/status/`, {
                request_id: requestId,
                status: status,
            });
            fecthPendingRequests();
        } catch (error) {
            console.error("Failed to update request status:", error);
        }
    }

    return (
        <div className="pending-requests">
            <h2>Pending Approvals</h2>
            <p>Review and manage time off requests from your team members.</p>
            <div className="requests-list">
                {pendingRequests.length === 0 ? (
                    <p>No pending requests.</p>
                ) : (
                    pendingRequests.map((request) => (
                        <div className="request-card" key={request.request_id}>
                            <div className="request-header">
                                <h3>{request.employee_name}</h3>
                                <span className={"badge status-pending"}>
                                    {request.status}
                                </span>
                                <span className="badge">{request.leave_type_name}</span>
                            </div>
                            <div className="request-body">
                                <div className="date-range">
                                    <span>
                                        <Calendar />
                                        {request.start_date} - {request.end_date}
                                    </span>
                                </div>
                                <div className="substitutes">
                                    <Users /> Substitutes:{" "}
                                    {request.substitutes.map((sub) => sub.employee_name).join(", ") || "None"}
                                </div>
                                <div className="reason">
                                    <strong>Comment:</strong> {request.comment || "No reason provided"}
                                </div>
                            </div>
                            <div className="request-actions">
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApproveDeclineRequest(request.request_id, true)}
                                >
                                    <Check /> Approve
                                </button>
                                <button
                                    className="decline-btn"
                                    onClick={() => handleApproveDeclineRequest(request.request_id, false)}
                                >
                                    <X /> Decline
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PendingHolidayRequests;