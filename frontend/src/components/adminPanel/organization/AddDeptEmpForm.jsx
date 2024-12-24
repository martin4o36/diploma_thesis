import { useState, useEffect } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/departmentStyles/AddDepartmentStyles.css";
import ConfigureAllowance from "./ConfigureAllowance";

function AddDeptEmpForm({ department, onClose }) {
    const departmentId = department?.key || 0;
    const [countries, setCountries] = useState([]);
    const [redirectToOtherForm, setRedirectToOtherForm] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await api.get("/api/country/");
            setCountries(response.data);
        };
        
        fetchCountries();
    }, []);

    const [formType, setFormType] = useState("department");
    const [departmentName, setDepartmentName] = useState("");
    const [employeeData, setEmployeeData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        password: '',
        age: '',
        email: '',
        phone_number: '',
        country: '',
        city: '',
        work_start: '',
        work_end: '',
        department_id: departmentId,
        manager_id: '',
        position: '',
        hired_date: '',
        left_date: '',
        profile_picture: null,
    });

    const handleEmployeeChange = (e) => {
        const { name, value, files } = e.target;
        setEmployeeData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleFormTypeSwitch = (type) => {
        setFormType(type);
        setDepartmentName("");
        setEmployeeData({
            ...employeeData,
            first_name: '',
            last_name: '',
            password: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formType === "department") {
                await api.post("/api/departments/add/", {
                    dep_name: departmentName,
                    parent_dept_id: department?.key || 0,
                });
                alert("Department added successfully!");
            } else {
                const formData = new FormData();
                Object.entries(employeeData).forEach(([key, value]) =>
                    formData.append(key, value)
                );
                // await api.post("/api/employee/add/", formData, {
                //     headers: { "Content-Type": "multipart/form-data" },
                // });
                setIsFormSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to save. Please try again.");
        }
    };

    if (isFormSubmitted && redirectToOtherForm) {
        return <ConfigureAllowance />;
    }

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Add {formType === "department" ? "Department" : "Employee"}</h2>
                <p>Parent Department: {department?.title || "None"}</p>
            </div>
            <div className="form-type-toggle">
                <button
                    type="button"
                    className={`toggle-button ${formType === "department" ? "active" : ""}`}
                    onClick={() => handleFormTypeSwitch("department")}
                >
                    Add Department
                </button>
                <button
                    type="button"
                    className={`toggle-button ${formType === "employee" ? "active" : ""}`}
                    onClick={() => handleFormTypeSwitch("employee")}
                >
                    Add Employee
                </button>
            </div>
            <form onSubmit={handleSubmit} className="form-body">
                {formType === "department" && (
                    <div className="form-group">
                        <label htmlFor="departmentName">Department Name</label>
                        <input
                            type="text"
                            id="departmentName"
                            name="departmentName"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            required
                        />
                    </div>
                )}
                {formType === "employee" && (
                    <>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={employeeData.first_name}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle_name">Middle Name</label>
                            <input
                                type="text"
                                id="middle_name"
                                name="middle_name"
                                value={employeeData.middle_name}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={employeeData.last_name}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={employeeData.password}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={employeeData.age}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={employeeData.email}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone_number">Phone Number</label>
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                value={employeeData.phone_number}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <select
                                id="country"
                                name="country"
                                value={employeeData.country}
                                onChange={handleEmployeeChange}
                                // required
                            >
                                <option value="">Select Country</option>
                                {countries.length > 0 ? (
                                    countries.map((country) => (
                                        <option key={country.country_id} value={country.country_id}>
                                            {country.country_name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Loading countries...</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={employeeData.city}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="work_start">Work Start Time</label>
                            <input
                                type="time"
                                id="work_start"
                                name="work_start"
                                value={employeeData.work_start}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="work_end">Work End Time</label>
                            <input
                                type="time"
                                id="work_end"
                                name="work_end"
                                value={employeeData.work_end}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="manager_id">Manager ID</label>
                            <input
                                type="number"
                                id="manager_id"
                                name="manager_id"
                                value={employeeData.manager_id}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="position">Position</label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={employeeData.position}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hired_date">Hired Date</label>
                            <input
                                type="date"
                                id="hired_date"
                                name="hired_date"
                                value={employeeData.hired_date}
                                onChange={handleEmployeeChange}
                                // required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="left_date">Left Date</label>
                            <input
                                type="date"
                                id="left_date"
                                name="left_date"
                                value={employeeData.left_date}
                                onChange={handleEmployeeChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="profile_picture">Profile Picture</label>
                            <input
                                type="file"
                                id="profile_picture"
                                name="profile_picture"
                                onChange={handleEmployeeChange}
                            />
                        </div>
                    </>
                )}

                {formType === "employee" && isFormSubmitted && (
                    <div className="form-group">
                        <label>Do you want to configure allowances now?</label>
                        <div>
                            <button
                                type="button"
                                className="yes-button"
                                onClick={() => setRedirectToOtherForm(true)}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                className="no-button"
                                onClick={() => setRedirectToOtherForm(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="submit-button">Save</button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddDeptEmpForm;
