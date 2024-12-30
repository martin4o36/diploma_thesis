import { useState } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/leaveStyles/EditLeaveTypeStyles.css"
import { X } from "lucide-react";

function EditLeaveTypeForm({ leaveType, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        leave_name: leaveType.leave_name || "",
        days: leaveType.days || 0,
        default_bring_forward_days: leaveType.default_bring_forward_days || 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        if (!formData.leave_name || formData.days <= 0) {
            setErrorMessage("Name and days are required, and days must be greater than 0.");
            setIsSubmitting(false);
            return;
        }

        try {
            console.log(leaveType.leave_id)
            await api.put(`/api/leave-types/${leaveType.leave_id}/edit/`, formData);
            onSuccess();
        } catch (error) {
            console.error("Error updating leave type:", error);
            setErrorMessage("Failed to update the leave type. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-leave-overlay">
            <div className="add-leave-container">
                <div className="form-header">
                    <h1 className="add-leave-title">Edit Leave Type</h1>
                    <button className="close-button" onClick={onCancel}>
                        <X size={24} />
                    </button>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="leave_name" className="leave-label">
                        Leave Type Name:
                    </label>
                    <input
                        name="leave_name"
                        className="leave-form-input"
                        type="text"
                        value={formData.leave_name}
                        onChange={handleInputChange}
                        placeholder="Enter Leave Type Name"
                        required
                    />

                    <label htmlFor="days" className="leave-label">
                        Days Per Year:
                    </label>
                    <input
                        name="days"
                        className="leave-form-input"
                        type="number"
                        value={formData.days}
                        onChange={handleInputChange}
                        placeholder="Enter Days Per Year"
                        required
                        min="1"
                    />

                    <label htmlFor="daysBringForward" className="leave-label">
                        Default Days to Bring Forward:
                    </label>
                    <input
                        name="daysBringForward"
                        className="leave-form-input"
                        type="number"
                        value={formData.default_bring_forward_days}
                        onChange={handleInputChange}
                        placeholder="Enter Days to Bring Forward (Optional)"
                        min="0"
                    />

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="submit-leave-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            className="cancel-leave-btn"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditLeaveTypeForm;