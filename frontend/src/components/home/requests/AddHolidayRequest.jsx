import { useState, useEffect } from "react";
import api from "../../../api";
import { Calendar, Trash2, Edit2, Plus, Clock, User, MessageSquare, Info, Check } from "lucide-react";

function AddHolidayRequest({employee, onSave, onCancel}) {
    const [substitutes, setSubstitutes] = useState([]);
    const [approver, setApprover] = useState(null);
    const [allApprover, setAllApprovers] = useState(null);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [balance, setBalance] = useState([]);
    const [requestData, setRequestData] = useState({
        employee_id: "",
        leave_type_id: "",
        start_date: "",
        end_date: "",
        approver_id: "",
        comment: "",
        substitutes: [],
    });

    useEffect(() => {
        const fetchSubstitutes = async () => {
            const substitutesResponse = await api.get(`/api/employee/${employee.department_id}/by-department/`);
            setSubstitutes(substitutesResponse.data);
        };

        const fetchLeaveTypes = async () => {
            const LeaveTypesResponse = await api.get("/api/leave-types/");
            setLeaveTypes(LeaveTypesResponse.data);
        };

        const fetchApprover = async () => {
            const approverResponse = await api.get(`/api/employee/${employee.department_id}/manager/`);
            setApprover(approverResponse.data);
        };

        fetchSubstitutes();
        fetchLeaveTypes();
        fetchApprover();
    }, []);

    const fetchBalance = async (leave_type_id) => {

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubstitutesChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
        setRequestData((prev) => ({
            ...prev,
            substitutes: selectedOptions,
        }));
    };

    const handleSaveRequest = async () => {
        try {
            await api.post("/api/request/add-holiday/", requestData);
        } catch (error) {
            console.log("Error adding holiday request:", error)
        }
    }

    return (
        <div className="add-holiday-request-container">
            <h2>Add Holiday Request</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="leave_type_id">Leave Type</label>
                    <select
                        id="leave_type_id"
                        name="leave_type_id"
                        value={requestData.leave_type_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a leave type</option>
                        {leaveTypes.map((leave_type) => (
                            <option key={leave_type.leave_id} value={leave_type.leave_id}>
                                {leave_type.leave_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={requestData.start_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={requestData.end_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="approver_id">Approver</label>
                    <select
                        id="approver_id"
                        name="approver_id"
                        value={requestData.approver_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select an approver</option>
                        {approver && (
                            <option value={approver.employee_id}>
                                {approver.first_name} {approver.last_name}
                            </option>
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={requestData.comment}
                        onChange={handleInputChange}
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="substitutes">Substitutes</label>
                    <select
                        id="substitutes"
                        name="substitutes"
                        value={requestData.substitutes}
                        onChange={handleSubstitutesChange}
                        multiple
                    >
                        {substitutes.map((sub) => (
                            <option key={sub.employee_id} value={sub.employee_id}>
                                {sub.first_name} {sub.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleSaveRequest} className="save-btn">
                        Save Request
                    </button>
                    <button type="button" onClick={onCancel} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddHolidayRequest;