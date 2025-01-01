import api from "../../../api"
import { useState, useEffect } from "react";
import "../../../styles/adminPanelStyles/departmentStyles/AddEmployeeStyles.css";
import ConfigureAllowance from "./ConfigureAllowance";
import { Save, X } from "lucide-react";

function AddEmployeeForm({ department, onClose }) {
    const [countries, setCountries] = useState([]);
    const [employeeData, setEmployeeData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        password: "",
        age: "",
        email: "",
        phone_number: "",
        country: "",
        city: "",
        work_start: "",
        work_end: "",
        department_id: department.key,
        position: "",
        hired_date: "",
        left_date: "",
        profile_picture: null,
    });

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setEmployeeData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(employeeData).forEach(([key, value]) => formData.append(key, value));

        try {
            await api.post("/api/employee/add/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Employee added successfully!");
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Failed to add employee. Please try again.");
        }
    };

    return (
        <div className="add-employee-form">
            <div className="add-employee-form-scrollable">
                <div className="add-employee-form-header">
                    <h2 className="add-employee-form-title">Add New Employee</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Profile Information */}
                    <div className="add-employee-form-section">
                        <h3 className="add-employee-form-section-title">Profile Information</h3>
                        <div className="add-employee-form-group">
                            <div className="add-employee-form-profile-picture">
                                <label htmlFor="profile-picture">
                                    <span className="add-employee-form-profile-picture-icon">📷</span>
                                    <span className="add-employee-form-profile-picture-label">Upload</span>
                                </label>
                                <input
                                    type="file"
                                    id="profile-picture"
                                    name="profile_picture"
                                    onChange={handleChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                            <div className="add-employee-form-inline-group">
                                <div>
                                    <label htmlFor="first-name">First Name *</label>
                                    <input
                                        type="text"
                                        id="first-name"
                                        name="first_name"
                                        value={employeeData.first_name}
                                        onChange={handleChange}
                                        className="add-employee-form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="middle-name">Middle Name</label>
                                    <input
                                        type="text"
                                        id="middle-name"
                                        name="middle_name"
                                        value={employeeData.middle_name}
                                        onChange={handleChange}
                                        className="add-employee-form-input"
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
                                        className="add-employee-form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="add-employee-form-inline-group">
                                <div>
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={employeeData.email}
                                        onChange={handleChange}
                                        className="add-employee-form-input"
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
                                        className="add-employee-form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="add-employee-form-section">
                        <h3 className="add-employee-form-section-title">Location Details</h3>
                        <div className="add-employee-form-inline-group">
                            <div>
                                <label htmlFor="country">Country *</label>
                                <select
                                    id="country"
                                    name="country"
                                    value={employeeData.country}
                                    onChange={handleChange}
                                    className="add-employee-form-select"
                                    required
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
                                <label htmlFor="city">City *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={employeeData.city}
                                    onChange={handleChange}
                                    className="add-employee-form-input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="add-employee-form-section">
                        <h3 className="add-employee-form-section-title">Work Information</h3>
                        <div className="add-employee-form-inline-group">
                            <div>
                                <label htmlFor="work-start">Work Start Time *</label>
                                <input
                                    type="time"
                                    id="work-start"
                                    name="work_start"
                                    value={employeeData.work_start}
                                    onChange={handleChange}
                                    className="add-employee-form-input"
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
                                    className="add-employee-form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="add-employee-form-inline-group">
                            <div>
                                <label htmlFor="position">Position *</label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={employeeData.position}
                                    onChange={handleChange}
                                    className="add-employee-form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="hired-date">Hired Date *</label>
                                <input
                                    type="date"
                                    id="hired-date"
                                    name="hired_date"
                                    value={employeeData.hired_date}
                                    onChange={handleChange}
                                    className="add-employee-form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="add-employee-form-inline-group">
                            <div>
                                <label htmlFor="left-date">Left Date</label>
                                <input
                                    type="date"
                                    id="left-date"
                                    name="left_date"
                                    value={employeeData.left_date}
                                    onChange={handleChange}
                                    className="add-employee-form-input"
                                />
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
                                    checked={employeeData.grant_hr_access || false}
                                    onChange={() =>
                                        setEmployeeData((prev) => ({
                                            ...prev,
                                            grant_hr_access: !prev.grant_hr_access,
                                        }))
                                    }
                                />
                                <span className="add-employee-form-hr-label">Grant HR Role Access</span>
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="add-employee-form-actions">
                        <button
                            type="submit"
                            className="add-employee-form-button add-employee-form-button-save"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="add-employee-form-button add-employee-form-button-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEmployeeForm