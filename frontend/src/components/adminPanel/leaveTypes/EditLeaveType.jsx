import { useState } from "react";

function EditLeaveTypeForm({ leaveType, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        leave_name: leaveType.leave_name || "",
        days: leaveType.days || 0,
        default_bring_forward_days: leaveType.default_bring_forward_days || 0,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/leave-types/${leaveType.leave_id}/`, formData);
            onSuccess();
        } catch (error) {
            console.error("Error updating leave type:", error);
        }
    };

    return (
        <div className="edit-leave-type-form">
            <h3>Edit Leave Type</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="leave_name">Name</label>
                    <input
                        type="text"
                        id="leave_name"
                        name="leave_name"
                        value={formData.leave_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="days">Days</label>
                    <input
                        type="number"
                        id="days"
                        name="days"
                        value={formData.days}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="default_bring_forward_days">Default Days to Bring Forward</label>
                    <input
                        type="number"
                        id="default_bring_forward_days"
                        name="default_bring_forward_days"
                        value={formData.default_bring_forward_days}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        Save Changes
                    </button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditLeaveTypeForm;