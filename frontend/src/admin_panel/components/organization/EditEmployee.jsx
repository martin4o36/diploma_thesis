import { useState, useEffect } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/departmentStyles/EditEmployeeStyles.css";
import { Save, X, UploadIcon, Check } from "lucide-react";

function EditEmployee({ employee, onClose, refreshEmployees }) {
    const [countries, setCountries] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isHrSettingsChecked, setHrSettingsChecked] = useState(employee.roles.includes("HR") || employee.roles.includes("Owner"));
    const [employeeData, setEmployeeData] = useState({
        first_name: employee?.first_name || "",
        middle_name: employee?.middle_name || "",
        last_name: employee?.last_name || "",
        age: employee?.age || "",
        email: employee?.email || "",
        phone_number: employee?.phone_number || "",
        country: employee?.country || "",
        city: employee?.city || "",
        work_start: employee?.work_start || "",
        work_end: employee?.work_end || "",
        position: employee?.position || "",
        hired_date: employee?.hired_date || "",
        left_date: employee?.left_date || "",
        profile_picture: employee.profile_picture,
        department_id: employee.department_id || 0,
        grant_hr_access: isHrSettingsChecked,
    });
    const [oldDepartmentId, setOldDepartmentId] = useState(employee.department_id);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get("/api/country/");
                setCountries(response.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get("/api/departments/");
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === "department_id") {
            setEmployeeData((prev) => ({
                ...prev,
                [name]: value ? Number(value) : "",
            }));
        } else {
            setEmployeeData((prev) => ({
                ...prev,
                [name]: files ? files[0] : value,
            }));
        }    
    };

    const handleHrCheckboxChange = () => {
        setHrSettingsChecked((prev) => !prev);
        setEmployeeData((prev) => ({
            ...prev,
            grant_hr_access: !isHrSettingsChecked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedEmployee = { ...employeeData };
        const formData = new FormData();
        Object.entries(employeeData).forEach(([key, value]) => formData.append(key, value));

        try {
            await api.put(`/api/employee/${employee.employee_id}/edit/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (updatedEmployee.department_id !== oldDepartmentId) {
                refreshEmployees(oldDepartmentId, updatedEmployee.department_id);
            } else {
                refreshEmployees();
            }

            onClose();
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };
    
    return (
        <div className="edit-employee-modal">
            <div className="edit-employee-form-scrollable">
                <div className="edit-employee-form-header">
                    <h2 className="edit-employee-form-title">Edit Employee</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Profile Information */}
                    <div className="edit-employee-form-section">
                        <h3 className="edit-employee-form-section-title">Profile Information</h3>
                        <div className="edit-employee-form-group">
                            <div className="profile-picture-and-names">
                                <div className="edit-employee-form-profile-picture">
                                    <label htmlFor="profile-picture" className="edit-employee-form-profile-picture-label">
                                        <UploadIcon /> Upload a Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="profile-picture"
                                        name="profile_picture"
                                        onChange={handleChange}
                                        style={{ display: "none" }}
                                    />
                                    <div className="profile-picture-preview">
                                    {employeeData.profile_picture ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${employeeData.profile_picture}`}
                                            alt="Profile"
                                            className="profile-picture"
                                        />
                                    ) : (
                                        <span className="profile-picture-placeholder">No Photo</span>
                                    )}
                                    </div>
                                </div>
                                <div className="edit-employee-form-names">
                                    <div>
                                        <label htmlFor="first-name">First Name *</label>
                                        <input
                                            type="text"
                                            id="first-name"
                                            name="first_name"
                                            value={employeeData.first_name}
                                            onChange={handleChange}
                                            className="edit-employee-form-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="middle-name">Middle Name *</label>
                                        <input
                                            type="text"
                                            id="middle-name"
                                            name="middle_name"
                                            value={employeeData.middle_name}
                                            onChange={handleChange}
                                            className="edit-employee-form-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="last-name">Last Name *</label>
                                        <input
                                            type="text"
                                            id="last-name"
                                            name="last_name"
                                            value={employeeData.last_name}
                                            onChange={handleChange}
                                            className="edit-employee-form-input"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="edit-employee-form-inline-group">
                                <div>
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={employeeData.email}
                                        onChange={handleChange}
                                        className="edit-employee-form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone-number">Phone Number *</label>
                                    <input
                                        type="text"
                                        id="phone-number"
                                        name="phone_number"
                                        value={employeeData.phone_number}
                                        onChange={handleChange}
                                        className="edit-employee-form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="age">Age *</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={employeeData.age}
                                        onChange={handleChange}
                                        className="add-employee-form-input"
                                        min="18"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Location Details */}
                    <div className="edit-employee-form-section">
                        <h3 className="edit-employee-form-section-title">Location Details</h3>
                        <div className="edit-employee-form-inline-group">
                            <div>
                                <label htmlFor="country">Country</label>
                                <select
                                    id="country"
                                    name="country"
                                    value={employeeData.country}
                                    onChange={handleChange}
                                    className="edit-employee-form-select"
                                >
                                    <option value="">Select a country</option>
                                    {countries.map((country) => (
                                        <option key={country.country_id} value={country.country_id}>
                                            {country.country_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={employeeData.city}
                                    onChange={handleChange}
                                    className="edit-employee-form-input"
                                />
                            </div>
                        </div>
                    </div>
    
                    {/* Work Information */}
                    <div className="edit-employee-form-section">
                        <h3 className="edit-employee-form-section-title">Work Information</h3>
                        <div className="edit-employee-form-inline-group">
                            <div>
                                <label htmlFor="work-start">Work Start Time *</label>
                                <input
                                    type="time"
                                    id="work-start"
                                    name="work_start"
                                    value={employeeData.work_start}
                                    onChange={handleChange}
                                    className="edit-employee-form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="work-end">Work End Time *</label>
                                <input
                                    type="time"
                                    id="work-end"
                                    name="work_end"
                                    value={employeeData.work_end}
                                    onChange={handleChange}
                                    className="edit-employee-form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="edit-employee-form-inline-group">
                            <div>
                                <label htmlFor="hired-date">Hired Date *</label>
                                <input
                                    type="date"
                                    id="hired-date"
                                    name="hired_date"
                                    value={employeeData.hired_date}
                                    onChange={handleChange}
                                    className="edit-employee-form-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="left-date">Left Date</label>
                                <input
                                    type="date"
                                    id="left-date"
                                    name="left_date"
                                    value={employeeData.left_date}
                                    onChange={handleChange}
                                    className="edit-employee-form-input"
                                />
                            </div>
                        </div>
                        <div className="edit-employee-form-inline-group">
                            <div>
                                <label htmlFor="position">Position *</label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={employeeData.position}
                                    onChange={handleChange}
                                    className="edit-employee-form-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="department-name">Department</label>
                                <select
                                    id="department-name"
                                    name="department_id"
                                    value={employeeData.department_id || 0}
                                    onChange={handleChange}
                                    className="edit-employee-form-select"
                                >
                                    <option value="0">None</option>
                                    {departments.map((dept) => (
                                        <option key={dept.department_id} value={dept.department_id}>
                                            {dept.dep_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="add-employee-form-section">
                        <h3 className="add-employee-form-section-title">HR Settings</h3>
                        <div className="add-employee-form-hr-settings">
                            <label className="add-employee-form-hr-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    name="grant_hr_access"
                                    className="add-employee-form-hr-checkbox"
                                    checked={isHrSettingsChecked}
                                    onChange={handleHrCheckboxChange}
                                />
                                <span className="add-employee-form-hr-label">Grant HR Role Access</span>
                            </label>

                            {isHrSettingsChecked && (
                                <div className="add-employee-form-hr-options">
                                    <div className="add-employee-form-hr-option">
                                        <Check className="hr-check-icon" />
                                        <span>Manage Leave Types</span>
                                    </div>
                                    <div className="add-employee-form-hr-option">
                                        <Check className="hr-check-icon" />
                                        <span>Manage Employees and Departments</span>
                                    </div>
                                    <div className="add-employee-form-hr-option">
                                        <Check className="hr-check-icon" />
                                        <span>Manage Employee Holiday Allowances and Balances</span>
                                    </div>
                                    <div className="add-employee-form-hr-option">
                                        <Check className="hr-check-icon" />
                                        <span>Manage Employee Holiday Records</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
    
                    {/* Form Actions */}
                    <div className="edit-employee-form-actions">
                        <button type="submit" className="edit-employee-form-button save">
                            <Save /> Save
                        </button>
                        <button type="button" className="edit-employee-form-button cancel" onClick={onClose}>
                            <X /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );    
}

export default EditEmployee;