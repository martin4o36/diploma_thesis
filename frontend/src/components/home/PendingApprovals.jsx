import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import api from "../../api";
import "../../styles/requests/PendingApprovals.css"

function PendingApprovals({ employee, hasManagerPermission }) {
    const [pendingApprovalRequests, setPendingApprovalRequests] = useState([]);
    const [myPendingRequests, setMyPendingRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("myRequests");

    const fetchPendingApprovalRequests = async () => {
        try {
            const response = await api.get(`/api/request/${employee.employee_id}/pending-approval/`);
            console.log(response.data);
            const combinedRequests = [
                ...response.data.holiday_requests.map(req => ({
                    ...req,
                    type: req.leave_type_name + " Request",
                    category: "holiday",
                })),
                ...response.data.remote_requests.map(req => ({
                    ...req,
                    type: "Remote Request",
                    category: "remote",
                })),
            ];
            console.log(response.data);
            setPendingApprovalRequests(combinedRequests);
        } catch (error) {
            console.error("Failed to fetch pending requests:", error);
        }
    };

    const fetchMyPendingRequests = async () => {
        try {
            const response = await api.get(`/api/request/${employee.employee_id}/my-pending/`);
            const combinedRequests = [
                ...response.data.holiday_requests.map(req => ({ ...req, type: req.leave_type_name + " Request" })),
                ...response.data.remote_requests.map(req => ({ ...req, type: "Remote Request" }))
            ];
            setMyPendingRequests(combinedRequests);
        } catch (error) {
            console.error("Failed to fetch my pending requests:", error);
        }
    };

    useEffect(() => {
        fetchMyPendingRequests();
    }, [employee.employee_id, hasManagerPermission]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "pendingApprovals" && hasManagerPermission && pendingApprovalRequests.length === 0) {
            fetchPendingApprovalRequests();
        }
    };

    const handleApproveDeclineRequest = async (requestId, isApproved, category) => {
        const status = isApproved ? "Approved" : "Rejected";
        const apiEndpoint = category === "holiday"
            ? "/api/request/holiday/status/"
            : "/api/request/remote/status/";

        try {
            await api.post(apiEndpoint, {
                request_id: requestId,
                status: status,
            });
            fetchPendingApprovalRequests();
        } catch (error) {
            console.error("Failed to update request status:", error);
        }
    };

    return (
        <div className="pending-approvals">
            <div className="tab-navigation">
                <div
                    className={`tab-item ${activeTab === "myRequests" ? "active" : ""}`}
                    onClick={() => handleTabChange("myRequests")}
                >
                    My Requests
                </div>

                {hasManagerPermission && (
                    <div
                        className={`tab-item ${activeTab === "pendingApprovals" ? "active" : ""}`}
                        onClick={() => handleTabChange("pendingApprovals")}
                    >
                        Pending Approvals
                    </div>
                )}
            </div>

            <div className="requests-container">
                {activeTab === "pendingApprovals" && hasManagerPermission && (
                    <div className="requests-list">
                        {pendingApprovalRequests.length === 0 ? (
                            <p>No pending approval requests.</p>
                        ) : (
                            pendingApprovalRequests.map((request) => (
                                <div key={request.request_id || request.remote_id} className="request-card">
                                    <div className="request-header">
                                        <span className="employee-name">{request.employee_name}</span>
                                        <span className={`badge remote`}>
                                            {request.type}
                                        </span>
                                    </div>
                                    <div className="request-dates">
                                        <span className="request-dates">{`${request.start_date} - ${request.end_date} • ${calculateDays(request.start_date, request.end_date)} days`}</span>
                                    </div>
                                    <div className="request-actions">
                                        <button className="approve-btn" onClick={() => handleApproveDeclineRequest(request.request_id || request.remote_id, true, request.category)}>
                                            <Check />
                                        </button>
                                        <button className="reject-btn" onClick={() => handleApproveDeclineRequest(request.request_id || request.remote_id, false, request.category)}>
                                            <X />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "myRequests" && (
                    <div className="requests-list">
                        {myPendingRequests.length === 0 ? (
                            <p>No pending requests.</p>
                        ) : (
                            myPendingRequests.map((request) => (
                                <div key={request.request_id || request.remote_id} className="request-card">
                                    <div className="request-header">
                                        <h3 className="request-title">{request.type}</h3>
                                        <span className="badge pending">Pending</span>
                                    </div>
                                    <div className="request-body">
                                        <span className="request-dates">{`${request.start_date} - ${request.end_date} • ${calculateDays(request.start_date, request.end_date)} days`}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function calculateDays(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
}

export default PendingApprovals;