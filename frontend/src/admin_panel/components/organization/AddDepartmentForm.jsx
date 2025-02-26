import { useState, useEffect } from "react";
import api from "../../../api";
import "../../../styles/admin_panel_styles/departmentStyles/AddDepartmentStyles.css";
import { Save, X } from "lucide-react";

function AddDepartmentForm({ department, onClose, refreshData }) {
    const [departmentName, setDepartmentName] = useState("");
    const [employees, setEmployees] = useState([]);
    const [selectedManager, setSelectedManager] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get("/api/employee/all/");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/departments/add/", {
                dep_name: departmentName,
                parent_dept_id: department?.key || 0,
                manager_id: selectedManager,
            });

            refreshData();
            onClose();
        } catch (error) {
            console.error("Error adding department:", error);
        }
    };

    return (
        <div className="add-department-modal">
            <div className="add-department-header">
                <h2 className="add-department-title">Add Department</h2>
                <p className="add-department-parent">
                    <strong>Parent Department:</strong> {department?.title || "None"}
                </p>
            </div>
            <form onSubmit={handleSubmit} className="add-department-form">
                <div className="add-department-form-group">
                    <label htmlFor="departmentName" className="add-department-label">
                        Department Name
                    </label>
                    <input
                        type="text"
                        id="departmentName"
                        className="add-department-input"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        placeholder="Enter department name"
                        required
                    />
                </div>

                <div className="add-department-form-group">
                    <label htmlFor="manager" className="add-department-label">
                        Select Manager
                    </label>
                    <select
                        id="manager"
                        className="add-department-select"
                        value={selectedManager}
                        onChange={(e) => setSelectedManager(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a manager
                        </option>
                        {employees.map((employee) => (
                            <option key={employee.employee_id} value={employee.employee_id}>
                                {employee.first_name} {employee.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="add-department-actions">
                    <button type="submit" className="add-department-btn save">
                        <Save /> Save
                    </button>
                    <button type="button" className="add-department-btn cancel" onClick={onClose}>
                        <X /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddDepartmentForm;
