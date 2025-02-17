import { useState } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/leaveStyles/AddLeaveTypeStyles.css";
import { Save, X } from "lucide-react";

function AddLeaveTypeForm({ onSuccess, onCancel }) {
    const [name, setName] = useState("");
    const [days, setDays] = useState("");
    const [daysBringForward, setDaysBringForward] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || days.trim() === "") {
            alert("Please fill in the name!");
            return;
        }

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
        }
    }

    return (
        <div>
            <div className="add-leave-modal-overlay" onClick={onCancel}></div>
            <div className="add-leave-modal">
                <div className="add-leave-header">
                    <h2 className="add-leave-title">Add Leave Type</h2>
                </div>
                <form onSubmit={handleSubmit} className="add-leave-form">
                    <div className="add-leave-form-group">
                        <label htmlFor="leave_name" className="add-leave-label">
                            Leave Type Name
                        </label>
                        <input
                            type="text"
                            id="leave_name"
                            className="add-leave-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter leave type name"
                            required
                        />
                    </div>

                    <div className="add-leave-form-group">
                        <label htmlFor="days" className="add-leave-label">
                            Days Per Year
                        </label>
                        <input
                            type="number"
                            id="days"
                            className="add-leave-input"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            placeholder="Enter days per year"
                            required
                            min="1"
                        />
                    </div>

                    <div className="add-leave-form-group">
                        <label htmlFor="daysBringForward" className="add-leave-label">
                            Default Days to Bring Forward
                        </label>
                        <input
                            type="number"
                            id="daysBringForward"
                            className="add-leave-input"
                            value={daysBringForward}
                            onChange={(e) => setDaysBringForward(e.target.value)}
                            placeholder="Enter days to bring forward"
                            min="0"
                        />
                    </div>

                    <div className="add-leave-actions">
                        <button type="submit" className="add-leave-btn save">
                            <Save /> Save
                        </button>
                        <button type="button" className="add-leave-btn cancel" onClick={onCancel}>
                            <X /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddLeaveTypeForm;