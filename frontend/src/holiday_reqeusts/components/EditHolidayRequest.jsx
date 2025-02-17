import { useState, useEffect } from "react";
import api from "../../api";
import { Calendar, Trash2, Edit2, Plus, Clock, User, MessageSquare, Info, Check, Save, X, } from "lucide-react";
import "../../styles/requests/EditRequest.css"

function EditHolidayRequest({ employee, request, onSave, onCancel }) {
    const [substitutes, setSubstitutes] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [requestData, setRequestData] = useState({
        ...request,
        substitutes: request.substitutes || [],
    });
    console.log(requestData);

    useEffect(() => {
        const fetchSubstitutes = async () => {
            try {
                const substitutesResponse = await api.get(
                    `/api/employee/${employee.department_id}/by-department/`
                );
                setSubstitutes(substitutesResponse.data);
            } catch (error) {
                console.error("Error fetching substitutes:", error);
            }
        };

        const fetchLeaveTypes = async () => {
            try {
                const leaveTypesResponse = await api.get("/api/leave-types/");
                setLeaveTypes(leaveTypesResponse.data);
            } catch (error) {
                console.error("Error fetching leave types:", error);
            }
        };

        fetchSubstitutes();
        fetchLeaveTypes();
    }, [employee]);

    const fetchLeaveBalance = async (leave_type_id) => {
        try {
            const response = await api.get(
                `/api/leave-balance/${employee.employee_id}/leave-type/${leave_type_id}/`
            );
            setLeaveBalance(response.data);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    useEffect(() => {
        if (request.leave_type) {
            fetchLeaveBalance(request.leave_type);
        }
    }, [request]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "leave_type") {
            fetchLeaveBalance(value);
        }
    };

    const handleSubstituteChange = (index, value) => {
        const updatedSubstitutes = [...requestData.substitutes];
        updatedSubstitutes[index] = value;
        setRequestData((prev) => ({
            ...prev,
            substitutes: updatedSubstitutes,
        }));
    };

    const addSubstituteField = () => {
        setRequestData((prev) => ({
            ...prev,
            substitutes: [...prev.substitutes, ""],
        }));
    };

    const removeSubstituteField = (index) => {
        const updatedSubstitutes = requestData.substitutes.filter((_, i) => i !== index);
        setRequestData((prev) => ({
            ...prev,
            substitutes: updatedSubstitutes,
        }));
    };

    const handleSaveRequest = async () => {
        try {
            console.log(requestData);
            await api.put(`/api/request/${request.request_id}/edit-holiday/`, requestData);
            onSave();
        } catch (error) {
            console.error("Error updating holiday request:", error);
        }
    };

    return (
        <div>
            <div className="edit-holiday-modal-overlay" onClick={onCancel}></div>
            <div className="edit-holiday-modal">
                <div className="edit-holiday-header">
                    <h2 className="edit-holiday-title">Edit Holiday Request</h2>
                </div>
                <form
                    className="edit-holiday-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="form-row inline">
                        <div className="form-group">
                            <label className="form-label">Leave Type</label>
                            <select
                                name="leave_type"
                                value={requestData.leave_type || ""}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="">Select leave type</option>
                                {leaveTypes.map((type) => (
                                    <option key={type.leave_id} value={type.leave_id}>
                                        {type.leave_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {leaveBalance && (
                            <div className="form-group leave-balance-inline">
                                <div className="leave-balance-info">
                                    <p className="leave-balance-text">
                                        Remaining Days: {leaveBalance.days - leaveBalance.days_used} /{" "}
                                        {leaveBalance.days}
                                    </p>
                                    <p className="leave-balance-validity">
                                        Valid From: {leaveBalance.period_start_date} To:{" "}
                                        {leaveBalance.period_end_date}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

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

                    <div className="form-row inline">
                        <div className="form-group">
                            <label className="form-label">Approver</label>
                            <select
                                name="approver_id"
                                value={requestData.approver || ""}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="">Select approver</option>
                                <option value={requestData.approver}>
                                    {requestData.approver_name}
                                </option>
                            </select>
                        </div>
                        <div className="form-group substitute-group">
                            <label className="form-label">Substitutes</label>
                            {requestData.substitutes.map((substitute, index) => (
                                <div key={index} className="substitute-row">
                                    <select
                                        value={substitute}
                                        onChange={(e) => handleSubstituteChange(index, e.target.value)}
                                        className="form-select substitute-select"
                                    >
                                        <option value="">Select substitute</option>
                                        {substitutes.map((sub) => (
                                            <option key={sub.employee_id} value={sub.employee_id}>
                                                {sub.first_name} {sub.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="btn-remove-substitute"
                                        onClick={() => removeSubstituteField(index)}
                                    >
                                        🗑
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn-add-substitute"
                                onClick={addSubstituteField}
                            >
                                + Add Substitute
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Comment</label>
                        <textarea
                            name="comment"
                            value={requestData.comment || ""}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Add any additional information about your request..."
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" onClick={handleSaveRequest}>
                            <Save /> Save Changes
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            <X /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditHolidayRequest;