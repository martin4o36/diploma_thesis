import { useState } from "react";
import api from "../../api";
import "../../styles/adminPanelStyles/AddLeaveTypeStyles.css"

function AddLeaveTypeForm({ onSuccess, onCancel }) {
    const [name, setName] = useState("");
    const [days, setDays] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || days.trim() === "") {
            alert("Please fill in all fields!");
            return;
        }

        setLoading(true);

        try {
            await api.post("/api/add_leave_type/", {
                leave_name: name,
                days: Number(days),
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
        <div className="add-leave-container">
            <h1 className="add-leave-title">Add Leave Type</h1>

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
                    Number of Days:
                </label>
                <input
                    name="days"
                    className="leave-form-input"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Enter Number of Days"
                    required
                    min="1"
                />

                <div className="form-buttons">
                    <button
                        type="submit"
                        className="submit-leave-btn"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
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
    );
}

export default AddLeaveTypeForm;