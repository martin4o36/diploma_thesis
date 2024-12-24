import { useEffect, useState } from "react";
import api from "../../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/adminPanelStyles/departmentStyles/ConfigureAllowanceStyle.css"

function ConfigureAllowance() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: null,
        endDate: null,
        numberOfDays: "",
        daysToBringForward: "",
        comment: "",
    });

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await api.get("/api/leave-types/");
                setLeaveTypes(response.data);
            } catch (error) {
                console.log("Error fetching leave types:", error);
            }
        };

        fetchLeaveTypes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name, date) => {
        setFormData((prev) => ({
            ...prev,
            [name]: date,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
        alert("Allowance configured successfully!");
    };

    return (
        <form className="configure-allowance-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="leaveType">Leave Type</label>
                <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select leave type</option>
                    {leaveTypes.map((leaveType) => (
                        <option key={leaveType.leave_id} value={leaveType.leave_id}>
                            {leaveType.leave_name} (Default: {leaveType.days} days)
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <DatePicker
                        selected={formData.startDate}
                        onChange={(date) => handleDateChange("startDate", date)}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        id="startDate"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <DatePicker
                        selected={formData.endDate}
                        onChange={(date) => handleDateChange("endDate", date)}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        id="endDate"
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="numberOfDays">Number of Days</label>
                    <input
                        type="number"
                        id="numberOfDays"
                        name="numberOfDays"
                        value={formData.numberOfDays}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="daysToBringForward">Days to Carry Forward</label>
                    <input
                        type="number"
                        id="daysToBringForward"
                        name="daysToBringForward"
                        value={formData.daysToBringForward}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Add any additional comments here..."
                    rows="3"
                ></textarea>
            </div>

            <div className="form-actions">
                <button type="submit" className="allowance-submit-button">Save Allowance</button>
            </div>
        </form>
    );
}

export default ConfigureAllowance;