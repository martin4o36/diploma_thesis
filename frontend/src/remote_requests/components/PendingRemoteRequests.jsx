import { useState, useEffect } from "react";
import { Calendar, Check, X } from "lucide-react";
import "../../styles/requests/PendingRequests.css";
import api from "../../api";

function PendingRemoteRequests({ employee }) {
    const [pendingRequests, setPendingRequests] = useState([]);

    const fetchPendingRequests = async () => {
        const response = await api.get(`/api/request/${employee.employee_id}/remote/pending/`);
        console.log(response.data);
        setPendingRequests(response.data);
    };

    useEffect(() => {
        fetchPendingRequests();
    }, [])

    const handleApproveDeclineRequest = async (requestId, isApproved) => {
        const status = isApproved ? "Approved" : "Rejected";
        try {
            await api.post(`/api/request/remote/status/`, {
                request_id: requestId,
                status: status,
            });
            fetchPendingRequests();
        } catch (error) {
            console.error("Failed to update request status:", error);
        }
    };

    return (
        <div className="pending-requests">
            <h2>Pending Remote Work Requests</h2>
            <p>Review and manage remote work requests from your team members.</p>
            <div className="requests-list">
                {pendingRequests.length === 0 ? (
                    <p>No pending requests.</p>
                ) : (
                    pendingRequests.map((request) => (
                        <div className="request-card" key={request.remote_id}>
                            <div className="request-header">
                                <h3>{request.employee_name}</h3>
                                <span className={"badge status-pending"}>
                                    {request.status}
                                </span>
                            </div>
                            <div className="request-body">
                                <div className="date-range">
                                    <span>
                                        <Calendar />
                                        {request.start_date} - {request.end_date}
                                    </span>
                                </div>
                                <div className="reason">
                                    <strong>Comment:</strong> {request.comment || "No comment provided"}
                                </div>
                            </div>
                            <div className="request-actions">
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApproveDeclineRequest(request.remote_id, true)}
                                >
                                    <Check /> Approve
                                </button>
                                <button
                                    className="decline-btn"
                                    onClick={() => handleApproveDeclineRequest(request.remote_id, false)}
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

export default PendingRemoteRequests;