import { Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../api";
import "../../../styles/admin_panel_styles/balances/AddLeaveBalanceStyle.css"

function AddLeaveBalance({ employee, onSuccess, onCancel }) {
    console.log(employee);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveBalanceData, setLeaveBalanceData] = useState({
        employee_id: employee.employee_id,
        leave_type_id: "",
        period_start_date: "",
        period_end_date: "",
        days: "",
        bring_forward: "",
        days_used: "",
        comment: "",
    });

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await api.get("/api/leave-types/");
                setLeaveTypes(response.data);
            } catch (error) {
                console.error("Error fetching leave types:", error);
            }
        }

        fetchLeaveTypes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveBalanceData({ ...leaveBalanceData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/api/leave-balance/add/", leaveBalanceData);
            onSuccess();
        } catch (error) {
            console.error("Error adding leave Balance:", error);
            alert("Failed to add leave balance.");
        }
    }

    return (
        <div>
            <div className="add-leave-balance-overlay" onClick={onCancel}></div>
            <div className="add-leave-balance-modal">
                <div className="add-leave-balance-header">
                    <h2 className="add-leave-balance-title">Add Leave Balance</h2>
                </div>

                <form onSubmit={handleSubmit} className="add-leave-balance-form">
                    <div className="add-leave-balance-inline-group">
                        <div>
                            <label htmlFor="leave_balance_name" className="add-leave-balance-label">
                                Leave Type
                            </label>
                            <select
                                name="leave_type_id"
                                className="add-leave-balance-input"
                                value={leaveBalanceData.leave_type_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select Leave Type</option>
                                {leaveTypes.map((type) => (
                                    <option key={type.leave_id} value={type.leave_id}>
                                        {type.leave_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="days" className="add-leave-balance-label">
                                Days
                            </label>
                            <input
                                name="days"
                                className="add-leave-balance-input"
                                type="number"
                                value={leaveBalanceData.days}
                                onChange={handleInputChange}
                                placeholder="Enter Days"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="add-leave-balance-inline-group">
                        <div>
                            <label htmlFor="period_start_date" className="add-leave-balance-label">
                                Period Start Date
                            </label>
                            <input
                                name="period_start_date"
                                className="add-leave-balance-input"
                                type="date"
                                value={leaveBalanceData.period_start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="period_end_date" className="add-leave-balance-label">
                                Period End Date
                            </label>
                            <input
                                name="period_end_date"
                                className="add-leave-balance-input"
                                type="date"
                                value={leaveBalanceData.period_end_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="add-leave-balance-inline-group">
                        <div>
                            <label htmlFor="bring_forward" className="add-leave-balance-label">
                                Bring Forward
                            </label>
                            <input
                                name="bring_forward"
                                className="add-leave-balance-input"
                                type="number"
                                value={leaveBalanceData.bring_forward}
                                onChange={handleInputChange}
                                placeholder="Enter Bring Forward Days"
                                min="0"
                            />
                        </div>

                        <div>
                            <label htmlFor="days_used" className="add-leave-balance-label">
                                Days Used
                            </label>
                            <input
                                name="days_used"
                                className="add-leave-balance-input"
                                type="number"
                                value={leaveBalanceData.days_used}
                                onChange={handleInputChange}
                                placeholder="Enter Days Used"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="add-leave-balance-inline-group">
                        <label htmlFor="comment" className="add-leave-balance-label">
                            Comment
                        </label>
                        <textarea
                            name="comment"
                            className="add-leave-balance-input"
                            value={leaveBalanceData.comment}
                            onChange={handleInputChange}
                            placeholder="Enter Comment (Optional)"
                        />
                    </div>

                    <div className="add-leave-balance-actions">
                        <button type="submit" className="add-leave-balance-btn save">
                            <Save /> Save
                        </button>
                        <button type="button" className="add-leave-balance-btn cancel" onClick={onCancel}>
                            <X /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddLeaveBalance;