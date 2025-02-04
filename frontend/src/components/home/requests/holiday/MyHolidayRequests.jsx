import { useState, useEffect, useMemo } from "react";
import api from "../../../../api";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Calendar, User, Users, MessageSquare } from "lucide-react";
import "../../../../styles/requests/MyRequests.css"
import EditHolidayRequest from "./EditHolidayRequest";

function MyHolidayRequests({ employee }) {
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [requestToEdit, setRequestToEdit] = useState(null);
    const itemsPerPage = 10;

    const fetchRequests = async () => {
        try {
            const response = await api.get(`/api/request/${employee.employee_id}/holiday/`);
            console.log(response.data);
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [employee.employee_id]);

    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return requests.slice(startIndex, startIndex + itemsPerPage);
    }, [requests, currentPage, itemsPerPage]);

    const handleFilter = () => {
        if (!dateFilter.startDate || !dateFilter.endDate) return;
        const filtered = requests.filter((request) => {
            const requestStart = new Date(request.start_date);
            const requestEnd = new Date(request.end_date);
            const filterStart = new Date(dateFilter.startDate);
            const filterEnd = new Date(dateFilter.endDate);
            return requestStart >= filterStart && requestEnd <= filterEnd;
        });
        setRequests(filtered);
    };

    const clearFilters = () => {
        setDateFilter({ startDate: "", endDate: "" });
        fetchRequests();
    };

    const totalPages = Math.ceil(requests.length / itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleEditRequest = (request) => {
        setRequestToEdit(request);
        setIsEditing(true);
    };

    const handleDeleteRequest = async (requestId) => {
        try {
            await api.put(`/api/request/${requestId}/cancel-holiday/`);
            fetchRequests();
        } catch (error) {
            console.log("Failed to cancel request:", error)
        }
    };

    const handleSave = () => {
        fetchRequests();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="my-requests">
            <div className="filter-section">
                <h3>Filter Requests</h3>
                <div className="filter-inputs">
                    <input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) => setDateFilter((prev) => ({ ...prev, startDate: e.target.value }))}
                        placeholder="From Date"
                    />
                    <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) => setDateFilter((prev) => ({ ...prev, endDate: e.target.value }))}
                        min={dateFilter.startDate}
                        placeholder="To Date"
                    />
                </div>
                <div className="filter-actions">
                    <button onClick={handleFilter}>Apply Filter</button>
                    <button onClick={clearFilters}>Clear Filters</button>
                </div>
            </div>

            <div className="requests-list">
                <div className="pagination-info">
                    <span>
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, requests.length)} of {requests.length} requests
                    </span>
                    <div className="pagination-controls">
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                            <ChevronLeft /> Previous
                        </button>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                            Next <ChevronRight />
                        </button>
                    </div>
                </div>

                <div className="requests">
                    {paginatedRequests.map((request) => (
                        <div className="request-card" key={request.request_id}>
                            <div className="card-header">
                                <div>
                                    <h3>{request.leave_type_name}</h3>
                                    <span className={`status ${request.status.toLowerCase()}`}>{request.status}</span>
                                </div>
                                <div className="card-actions">
                                    <button onClick={() => handleEditRequest(request)}>
                                        <Edit2 />
                                    </button>
                                    <button onClick={() => handleDeleteRequest(request.request_id)}>
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div>
                                    <Calendar /> {request.start_date} - {request.end_date}
                                </div>
                                <div>
                                    <User /> Approver: {request.approver_name}
                                </div>
                                {request.comment && (
                                    <div>
                                        <MessageSquare /> Comment: 
                                        <p>{request.comment}</p>
                                    </div>
                                )}

                                {/* Display substitutes if available */}
                                {request.substitutes && request.substitutes.length > 0 && (
                                    <div>
                                        <Users /> Substitutes:
                                        <ul>
                                            {request.substitutes.map((substitute) => (
                                                <li key={substitute.substitute_id}>
                                                    {substitute.employee_name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {requests.length > itemsPerPage && (
                    <div className="pagination-footer">
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="pagination-controls">
                            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                                <ChevronLeft /> Previous
                            </button>
                            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                                Next <ChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isEditing && (
                <EditHolidayRequest
                    employee={employee}
                    request={requestToEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}

export default MyHolidayRequests;