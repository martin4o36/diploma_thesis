import { Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import "../../../styles/admin_panel_styles/countryStyles/EditNonWorkingDay.css"

function EditNonWorkingDay({ editingDay, onSave, onCancel }) {
    const [formData, setFormData] = useState({ date: "", description: "" });

    useEffect(() => {
        if (editingDay) {
            setFormData({
                date: editingDay.date.split("T")[0],
                description: editingDay.description,
            });
        }
    }, [editingDay]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const { date, description } = formData;
        if (date && description) {
            onSave({
                ...editingDay,
                date: `${date}T00:00:00Z`,
                description,
            });
        } else {
            alert("Both date and description are required.");
        }
    };

    return (
        <div>
            <div className="edit-non-working-day-overlay" onClick={onCancel}></div>
            <div className="edit-non-working-day-modal">
                <h3 className="edit-modal-heading">Edit Non-Working Day</h3>
                <div className="edit-form">
                    <div className="edit-form-group">
                        <label htmlFor="date" className="edit-form-label">Date:</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="edit-input"
                        />
                    </div>
                    <div className="edit-form-group">
                        <label htmlFor="description" className="edit-form-label">Description:</label>
                        <input
                            id="description"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Holiday description"
                            className="edit-input"
                        />
                    </div>
                </div>
                <div className="edit-actions">
                    <button onClick={handleSave} className="edit-button edit-button-save">
                        <Save className="edit-button-icon" /> Save
                    </button>
                    <button onClick={onCancel} className="edit-button edit-button-cancel">
                        <X className="edit-button-icon" /> Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditNonWorkingDay;