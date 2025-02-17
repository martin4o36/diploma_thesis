import { useState, useEffect } from "react";
import api from "../../api";
import { Calendar, Trash2, Edit2, Plus, Clock, User, MessageSquare, Info, Check } from "lucide-react";
import "../../styles/requests/AddRequest.css"

function AddHolidayRequest({employee, onSave, onCancel}) {
    const [substitutes, setSubstitutes] = useState([]);
    const [approver, setApprover] = useState(null);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [requestData, setRequestData] = useState({
        employee_id: employee.employee_id,
        leave_type_id: "",
        start_date: "",
        end_date: "",
        approver_id: 0,
        comment: "",
        substitutes: [],
    });

    useEffect(() => {
        const fetchSubstitutes = async () => {
            try {
                const substitutesResponse = await api.get(`/api/employee/${employee.department_id}/by-department/`);
                setSubstitutes(substitutesResponse.data);
            } catch (error) {
                console.log("Error fetching substitutes:", error);
            }
        };

        const fetchLeaveTypes = async () => {
            try {
                const LeaveTypesResponse = await api.get("/api/leave-types/");
                setLeaveTypes(LeaveTypesResponse.data);
            } catch (error) {
                console.log("Error fetching leave types:", error);
            }
        };

        const fetchApprover = async () => {
            try {
                const approverResponse = await api.get(`/api/employee/${employee.department_id}/manager/`);
                setApprover(approverResponse.data);
            } catch (error) {
                console.log("Error fetching approver:", error);
            }
        };

        fetchSubstitutes();
        fetchLeaveTypes();
        fetchApprover();
    }, [employee]);

    const fetchLeaveBalance = async (leave_type_id) => {
        try {
            const response = await api.get(`/api/leave-balance/${employee.employee_id}/leave-type/${leave_type_id}/`);
            console.log(response.data);
            setLeaveBalance(response.data);
        } catch (error) {
            console.log("Error fetching balance:", error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "leave_type_id") {
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
            await api.post("/api/request/add-holiday/", requestData);
        } catch (error) {
            console.log("Error adding holiday request:", error)
        }
    }

    return (
		<div className="add-request-container">
			<div className="add-request-header">
				<h2 className="add-request-title">New Time Off Request</h2>
				<p className="add-request-subtitle">
					Submit a new time off request for approval.
				</p>
			</div>
			<form
                className="add-request-form"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                {/* Leave Type and Balance */}
                <div className="form-row inline">
                    <div className="form-group">
                        <label className="form-label">Leave Type</label>
                        <select
                            name="leave_type_id"
                            value={requestData.leave_type_id}
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

                {/* Approver and Substitutes */}
                <div className="form-row inline">
                    <div className="form-group">
                        <label className="form-label">Approver</label>
                        <select
                            name="approver_id"
                            value={requestData.approver_id}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Select approver</option>
                            {approver && (
                                <option value={approver.employee_id}>
                                    {approver.first_name} {approver.last_name}
                                </option>
                            )}
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

export default AddHolidayRequest;