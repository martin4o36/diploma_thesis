import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/balances/EditLeaveBalanceStyles.css"

function EditLeaveBalance({ leaveBalance, employee_name, onSuccess, onCancel }) {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveBalanceData, setLeaveBalanceData] = useState({
        leave_type_id: leaveBalance.leave_type,
        period_start_date: leaveBalance.period_start_date,
        period_end_date: leaveBalance.period_end_date,
        days: leaveBalance.days,
        bring_forward: leaveBalance.bring_forward,
        days_used: leaveBalance.days_used,
        comment: leaveBalance.comment || "",
    });
    const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("");

        try {
            await api.put(`/api/leave-balance/${leaveBalance.balance_id}/edit/`, leaveBalanceData);
            onSuccess();
        } catch (error) {
            console.error("Error updating leave type:", error);
            setErrorMessage("Failed to update the leave type. Please try again.");
        }
    };

    return (
        <div>
            <div className="edit-leave-balance-overlay" onClick={onCancel}></div>
            <div className="edit-leave-balance-modal">
                <div className="edit-leave-balance-header">
                    <h2 className="edit-leave-balance-title">Edit Leave Balance</h2>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <form onSubmit={handleSubmit} className="edit-leave-balance-form">
                    <div className="edit-leave-balance-inline-group">
                        <div>
                            <label htmlFor="leave_balance_name" className="edit-leave-balance-label">
                                Leave Type
                            </label>
                            <select
                                name="leave_balance_type_id"
                                className="edit-leave-balance-input"
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
                            <label htmlFor="days" className="edit-leave-balance-label">
                                Days
                            </label>
                            <input
                                name="days"
                                className="edit-leave-balance-input"
                                type="number"
                                value={leaveBalanceData.days}
                                onChange={handleInputChange}
                                placeholder="Enter Days"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="edit-leave-balance-inline-group">
                        <div>
                            <label htmlFor="period_start_date" className="edit-leave-balance-label">
                                Period Start Date
                            </label>
                            <input
                                name="period_start_date"
                                className="edit-leave-balance-input"
                                type="date"
                                value={leaveBalanceData.period_start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="period_end_date" className="edit-leave-balance-label">
                                Period End Date
                            </label>
                            <input
                                name="period_end_date"
                                className="edit-leave-balance-input"
                                type="date"
                                value={leaveBalanceData.period_end_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="edit-leave-balance-inline-group">
                        <div>
                            <label htmlFor="bring_forward" className="edit-leave-balance-label">
                                Bring Forward
                            </label>
                            <input
                                name="bring_forward"
                                className="edit-leave-balance-input"
                                type="number"
                                value={leaveBalanceData.bring_forward}
                                onChange={handleInputChange}
                                placeholder="Enter Bring Forward Days"
                                min="0"
                            />
                        </div>

                        <div>
                            <label htmlFor="days_used" className="edit-leave-balance-label">
                                Days Used
                            </label>
                            <input
                                name="days_used"
                                className="edit-leave-balance-input"
                                type="number"
                                value={leaveBalanceData.days_used}
                                onChange={handleInputChange}
                                placeholder="Enter Days Used"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="edit-leave-balance-inline-group">
                        <label htmlFor="comment" className="edit-leave-balance-label">
                            Comment
                        </label>
                        <textarea
                            name="comment"
                            className="edit-leave-balance-input"
                            value={leaveBalanceData.comment}
                            onChange={handleInputChange}
                            placeholder="Enter Comment (Optional)"
                        />
                    </div>

                    <div className="edit-leave-balance-actions">
                        <button type="submit" className="edit-leave-balance-btn save">
                            <Save /> Save
                        </button>
                        <button type="button" className="edit-leave-balance-btn cancel" onClick={onCancel}>
                            <X /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditLeaveBalance;