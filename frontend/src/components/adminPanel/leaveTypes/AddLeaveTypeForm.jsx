import { useState } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/leaveStyles/AddLeaveTypeStyles.css";
import { X } from "lucide-react";

function AddLeaveTypeForm({ onSuccess, onCancel }) {
    const [name, setName] = useState("");
    const [days, setDays] = useState("");
    const [daysBringForward, setDaysBringForward] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || days.trim() === "") {
            alert("Please fill in the name!");
            return;
        }

        setLoading(true);

        try {
            await api.post("/api/leave-types/add/", {
                leave_name: name,
                days: Number(days),
                default_bring_forward_days: Number(daysBringForward),
            });
            onSuccess();
        } catch (error) {
            console.error("Error adding leave type:", error);
            alert("Failed to add leave type.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="add-leave-overlay">
            <div className="add-leave-container">
                <div className="form-header">
                    <h1 className="add-leave-title">Add Leave Type</h1>
                    <button className="close-button" onClick={onCancel}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="leave_name" className="leave-label">
                        Leave Type Name:
                    </label>
                    <input
                        name="leave_name"
                        className="leave-form-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
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
                        value={daysBringForward}
                        onChange={(e) => setDaysBringForward(e.target.value)}
                        placeholder="Enter Days to Bring Forward (Optional)"
                        min="0"
                    />

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="submit-leave-btn"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Add Leave Type"}
                        </button>
                        <button
                            type="button"
                            className="cancel-leave-btn"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddLeaveTypeForm;