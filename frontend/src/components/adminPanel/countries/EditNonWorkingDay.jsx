import { Save, X } from "lucide-react";
import { useState, useEffect } from "react";

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
        <div className="edit-non-working-day-modal">
            <h3>Edit Non-Working Day</h3>
            <div className="edit-form">
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="edit-date-input"
                    />
                </label>
                <label>
                    Description:
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Holiday description"
                        className="edit-description-input"
                    />
                </label>
            </div>
            <div className="edit-actions">
                <button onClick={handleSave} className="save-edit-button">
                    <Save className="icon" /> Save
                </button>
                <button onClick={onCancel} className="cancel-edit-button">
                    <X className="icon" /> Cancel
                </button>
            </div>
        </div>
    );
}

export default EditNonWorkingDay;