import { useState, useEffect } from "react";
import api from "../../../../api";
import "../../../../styles/requests/AddRequest.css"

function AddRemoteRequest({employee, onSave, onCancel}) {
    const [requestData, setRequestData] = useState({
        employee_id: employee.employee_id,
        start_date: "",
        end_date: "",
        approver_id: 0,
        comment: "",
    });
    const [approver, setApprover] = useState(null);

    useEffect(() => {
        const fetchApprover = async () => {
            try {
                const approverResponse = await api.get(`/api/employee/${employee.department_id}/manager/`);
                setApprover(approverResponse.data);
            } catch (error) {
                console.log("Error fetching approver:", error);
            }
        };

        fetchApprover();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveRequest = async () => {
        try {
            await api.post("/api/request/add-remote/", requestData);
            if (onSave) onSave();
        } catch (error) {
            console.log("Error adding remote request:", error);
        }
    };

    return (
        <div className="add-request-container">
            <div className="add-request-header">
                <h2 className="add-request-title">New Remote Work Request</h2>
                <p className="add-request-subtitle">
                    Submit a new remote work request for approval.
                </p>
            </div>
            <form
                className="add-request-form"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                {/* Period Start and End Dates */}
                <div className="form-row inline">
                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={requestData.start_date}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={requestData.end_date}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                {/* Approver */}
                <div className="form-row inline">
                    <div className="form-group">
                        <label className="form-label">Approver</label>
                        <select
                            name="approver_id"
                            value={requestData.approver_id}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select approver</option>
                            {approver && (
                                <option value={approver.employee_id}>
                                    {approver.first_name} {approver.last_name}
                                </option>
                            )}
                        </select>
                    </div>
                </div>

                {/* Comment */}
                <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea
                        name="comment"
                        value={requestData.comment}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Add any additional information about your request..."
                    />
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" onClick={handleSaveRequest}>
                        Submit Request
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddRemoteRequest;