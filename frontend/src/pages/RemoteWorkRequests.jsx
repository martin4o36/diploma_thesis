import { useState, useEffect, useMemo } from "react";
import AddHolidayRequest from "../components/home/requests/AddHolidayRequest";
import EditRemoteRequest from "../components/home/requests/EditRemoteRequest";
import api from "../api";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import "../styles/RequestStyles.css";

function RemoteWorkRequests({ employee }) {
    const [requests, setRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [canApproveRequests, setCanApproveRequests] = useState(employee.roles.includes("Manager") || employee.roles.includes("Owner"));
    const [selectedTab, setSelectedTab] = useState("myRequests");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchRequests = async () => {
            const response = await api.get(`/api/request/${employee.employee_id}/remote/`);
            setRequests(response.data);
        };

        fetchRequests();
    }, [employee.employee_id]);

    {canApproveRequests && useEffect(() => {
        const fecthPendingRequests = async () => {
            const response = await api.get(`/api/request/${employee.employee_id}/remote/pending/`);
            console.log(response.data);
            setPendingRequests(response.data);
        };

        fecthPendingRequests();
    }, [])}

    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return requests.slice(startIndex, startIndex + itemsPerPage);
    }, [requests, currentPage, itemsPerPage]);

    const renderTableContent = () => {
        return paginatedRequests.map((request, index) => (
            <tr key={index} className="remote-work-request-row">
                <td>{`${request.start_date} - ${request.end_date}`}</td>
                <td>
                    <span
                        className={`status-badge ${
                            request.status === "Approved" ? "status-approved" : request.status === "Waiting" ? "status-waiting" : "status-rejected"
                        }`}
                    >
                        {request.status}
                    </span>
                </td>
                <td>{request.approver_name}</td>
                <td className="action-buttons">
                    <button className="action-btn edit-btn" onClick={() => handleEditRequest(request)}>
                        <Edit2 className="action-btn-icon" />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteRequest(request.remote_id)}>
                        <Trash2 className="action-btn-icon" />
                    </button>
                </td>
            </tr>
        ));
    };

    const handleEditRequest = (request) => {
        console.log("Editing request:", request);
    };

    const handleDeleteRequest = (requestId) => {
        console.log("Deleting request with ID:", requestId);
    };

    return (
        <div className="remote-work-request-container">
            <h1 className="remote-work-request-heading">Vacation Management</h1>
            <div className="remote-work-request-tabs">
                <button
                    className={`tab-button ${selectedTab === "myRequests" ? "active" : ""}`}
                    onClick={() => setSelectedTab("myRequests")}
                >
                    My Requests
                </button>
                <button
                    className={`tab-button ${selectedTab === "addRequest" ? "active" : ""}`}
                    onClick={() => setSelectedTab("addRequest")}
                >
                    Add Request
                </button>
                {canApproveRequests && (
                    <button
                        className={`tab-button ${selectedTab === "pendingRequests" ? "active" : ""}`}
                        onClick={() => setSelectedTab("pendingRequests")}
                    >
                        Pending Requests
                    </button>
                )}
            </div>

            {selectedTab === "myRequests" && (
                <div className="tab-content">
                    <table className="requests-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Status</th>
                                <th>Approver</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>{renderTableContent()}</tbody>
                    </table>
                    <footer className="pagination">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            <ChevronLeft className="pagination-icon" />
                        </button>
                        <span className="pagination-current">{currentPage}</span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    currentPage < Math.ceil(requests.length / itemsPerPage) ? prev + 1 : prev
                                )
                            }
                            disabled={currentPage >= Math.ceil(requests.length / itemsPerPage)}
                            className="pagination-button"
                        >
                            <ChevronRight className="pagination-icon" />
                        </button>
                    </footer>
                </div>
            )}

            {selectedTab === "addRequest" && (
                <div className="tab-content">
                    <AddHolidayRequest />
                </div>
            )}

            {selectedTab === "pendingRequests" && canApproveRequests && (
                <div className="tab-content">
                    <h2 className="pending-requests-heading">Pending Requests</h2>
                    <p className="pending-requests-message">Show pending requests here...</p>
                </div>
            )}
        </div>
    );
}

export default RemoteWorkRequests;