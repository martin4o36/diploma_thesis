import { useState } from "react";
import api from "../../../api";
import "../../../styles/admin_panel_styles/leaveStyles/EditLeaveTypeStyles.css"
import { Save, X } from "lucide-react";

function EditLeaveTypeForm({ leaveType, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        leave_name: leaveType.leave_name || "",
        days: leaveType.days || 0,
        default_bring_forward_days: leaveType.default_bring_forward_days || 0,
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!formData.leave_name || formData.days <= 0) {
            setErrorMessage("Name and days are required, and days must be greater than 0.");
            return;
        }

        try {
            console.log(leaveType.leave_id)
            await api.put(`/api/leave-types/${leaveType.leave_id}/edit/`, formData);
            onSuccess();
        } catch (error) {
            console.error("Error updating leave type:", error);
            setErrorMessage("Failed to update the leave type. Please try again.");
        }
    };

    return (
        <div>
            <div className="edit-leave-modal-overlay" onClick={onCancel}></div>
            <div className="edit-leave-modal">
                <div className="edit-leave-header">
                    <h2 className="edit-leave-title">Edit Leave Type</h2>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <form onSubmit={handleSubmit} className="edit-leave-form">
                    <div className="edit-leave-form-group">
                        <label htmlFor="leave_name" className="edit-leave-label">
                            Leave Type Name
                        </label>
                        <input
                            name="leave_name"
                            className="edit-leave-input"
                            type="text"
                            value={formData.leave_name}
                            onChange={handleInputChange}
                            placeholder="Enter Leave Type Name"
                            required
                        />
                    </div>

                    <div className="edit-leave-form-group">
                        <label htmlFor="days" className="edit-leave-label">
                            Days Per Year
                        </label>
                        <input
                            name="days"
                            className="edit-leave-input"
                            type="number"
                            value={formData.days}
                            onChange={handleInputChange}
                            placeholder="Enter Days Per Year"
                            required
                            min="1"
                        />
                    </div>

                    <div className="edit-leave-form-group">
                        <label htmlFor="daysBringForward" className="edit-leave-label">
                            Default Days to Bring Forward
                        </label>
                        <input
                            name="daysBringForward"
                            className="edit-leave-input"
                            type="number"
                            value={formData.default_bring_forward_days}
                            onChange={handleInputChange}
                            placeholder="Enter Days to Bring Forward (Optional)"
                            min="0"
                        />
                    </div>

                    <div className="edit-leave-actions">
                        <button type="submit" className="edit-leave-btn save">
                            <Save /> Save
                        </button>
                        <button type="button" className="edit-leave-btn cancel" onClick={onCancel}>
                            <X /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditLeaveTypeForm;