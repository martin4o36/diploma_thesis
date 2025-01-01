import { useState, useEffect } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/departmentStyles/EditDepartmentStyles.css";
import { Save, X } from "lucide-react";

function EditDepartment({ department, onClose }) {
    const [departmentName, setDepartmentName] = useState(department.title || "");
    const [employees, setEmployees] = useState([]);
    const [selectedManager, setSelectedManager] = useState(department.manager_id || "");

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
            await api.put(`/api/departments/${department.key}/edit/`, {
                dep_name: departmentName,
                manager_id: selectedManager || department?.manager.id,
            });
        } catch (error) {
            console.error("Error updating department:", error);
        }
    };

    return (
        <div className="edit-department-modal">
            <div className="edit-department-header">
                <h2 className="edit-department-title">Edit Department</h2>
                <p className="edit-department-current-manager">
                    <strong>Current Manager:</strong> {department?.manager.name || "None"}
                </p>
            </div>
            <form onSubmit={handleSubmit} className="edit-department-form">
                <div className="edit-department-form-group">
                    <label htmlFor="departmentName" className="edit-department-label">Department Name</label>
                    <input
                        type="text"
                        id="departmentName"
                        className="edit-department-input"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                    />
                </div>

                <div className="edit-department-form-group">
                    <label htmlFor="manager" className="edit-department-label">Select Manager</label>
                    <select
                        id="manager"
                        className="edit-department-select"
                        value={selectedManager}
                        onChange={(e) => setSelectedManager(e.target.value)}
                    >
                        <option value="">None</option>
                        {employees.map((employee) => (
                            <option key={employee.employee_id} value={employee.employee_id}>
                                {employee.first_name} {employee.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="edit-department-actions">
                    <button type="submit" className="edit-department-btn save">
                        <Save /> Save
                    </button>
                    <button type="button" className="edit-department-btn cancel" onClick={onClose}>
                        <X /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditDepartment;