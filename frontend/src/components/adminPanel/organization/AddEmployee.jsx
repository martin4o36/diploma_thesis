import api from "../../../api"
import { useState, useEffect } from "react";
import "../../../styles/adminPanelStyles/departmentStyles/AddEmployeeStyles.css";
import { Save, X, ThumbsUp, UploadIcon, Check } from "lucide-react";

function AddEmployeeForm({ department, onClose, setSelectedContent, refreshEmployees }) {
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
        department_id: department ? department.key : 0,
        position: "",
        hired_date: "",
        left_date: "",
        profile_picture: null,
    });

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [isHrSettingsChecked, setHrSettingsChecked] = useState(false);

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

            refreshEmployees(employeeData.department_id);
            setIsFormSubmitted(true);
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    const handleConfigure = () => {
        setSelectedContent("Employee Details");
        onClose();
    };

    return (
        <div className="add-employee-modal">
            <div className="add-employee-form-scrollable">
                <div className="add-employee-form-header">
                    <h2 className="add-employee-form-title">Add New Employee</h2>
                </div>

                {isFormSubmitted ? (
                    <div className="add-employee-form-confirmation">
                        <h3>Employee has been saved successfully!</h3>
                        <p>Would you like to configure additional details now?</p>
                        <div className="add-employee-form-actions">
                            <button
                                type="button"
                                className="add-employee-form-button add-employee-form-button-save"
                                onClick={handleConfigure}
                            >
                                <ThumbsUp />
                                Yes, Configure Now
                            </button>
                            <button
                                type="button"
                                className="add-employee-form-button add-employee-form-button-cancel"
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                <X />
                                No, Later
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {department?.title ? (
                            <p className="add-employee-department">
                                <strong>Department:</strong> {department.title}
                            </p>
                        ) : null}
                        <div className="add-employee-form-section">
                            <h3 className="add-employee-form-section-title">Profile Information</h3>
                            <div className="add-employee-form-group">
                                <div className="profile-picture-and-names">
                                    <div className="add-employee-form-profile-picture">
                                        <label htmlFor="profile-picture" className="add-employee-form-profile-picture-label">
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
                                                    src={URL.createObjectURL(employeeData.profile_picture)}
                                                    alt="Profile"
                                                    className="profile-picture"
                                                />
                                            ) : (
                                                <span className="profile-picture-placeholder">No Photo</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="add-employee-form-names">
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
                                            <label htmlFor="middle-name">Middle Name *</label>
                                            <input
                                                type="text"
                                                id="middle-name"
                                                name="middle_name"
                                                value={employeeData.middle_name}
                                                onChange={handleChange}
                                                className="add-employee-form-input"
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
                                                className="add-employee-form-input"
                                            />
                                        </div>
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
                                <div className="add-employee-form-inline-group">
                                    <div>
                                        <label htmlFor="password">Password *</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={employeeData.password}
                                            onChange={handleChange}
                                            className="add-employee-form-input"
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
                        <div className="add-employee-form-section">
                            <h3 className="add-employee-form-section-title">Location Details</h3>
                            <div className="add-employee-form-inline-group">
                                <div>
                                    <label htmlFor="country">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={employeeData.country}
                                        onChange={handleChange}
                                        className="add-employee-form-select"
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
                                        className="add-employee-form-input"
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
                                        onChange={() => {
                                            setHrSettingsChecked(!isHrSettingsChecked);
                                            setEmployeeData((prev) => ({
                                                ...prev,
                                                grant_hr_access: !isHrSettingsChecked,
                                            }));
                                        }}
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
                        <div className="add-employee-form-actions">
                            <button
                                type="submit"
                                className="add-employee-form-button save"
                            >
                                <Save />
                                Save
                            </button>
                            <button
                                type="button"
                                className="add-employee-form-button cancel"
                                onClick={onClose}
                            >
                                <X />
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AddEmployeeForm