import { useState, useEffect } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/AddDepartmentStyles.css"

function AddDepartEmpForm({ department, onClose }) {
    const departmentId = department?.key || 0;

    const [formType, setFormType] = useState("department");
    const [departmentName, setDepartmentName] = useState("");
    const [employeeData, setEmployeeData] = useState({
        first_name: "",
        last_name: "",
        age: 0,
        email: "",
        country: 0,
        city: "",
        work_start: "",
        work_end: "",
        department_id: departmentId,
        manager_id: 0,
        position: "",
        hired_date: "",
        left_date: null,
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
            first_name: "",
            last_name: "",
            age: 0,
            email: "",
            country: 0,
            city: "",
            work_start: "",
            work_end: "",
            department_id: departmentId,
            manager_id: 0,
            position: "",
            hired_date: "",
            left_date: null,
            profile_picture: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formType === "department") {
                await api.post("/api/departments/add/", { 
                    dep_name: departmentName, 
                    parent_dept_id: department?.key || 0 
                });
            } else if (formType === "employee") {
                formData.append("first_name", employeeData.first_name);
                formData.append("last_name", employeeData.last_name);
                formData.append("age", employeeData.age);
                formData.append("email", employeeData.email);
                formData.append("country", employeeData.country);
                formData.append("city", employeeData.city);
                formData.append("work_start", employeeData.work_start);
                formData.append("work_end", employeeData.work_end);
                formData.append("department_id", employeeData.department_id);
                formData.append("manager_id", employeeData.manager_id);
                formData.append("position", employeeData.position);
                formData.append("hired_date", employeeData.hired_date);
                if (employeeData.left_date) {
                    formData.append("left_date", employeeData.left_date);
                }
                if (employeeData.profile_picture) {
                    formData.append("profile_picture", employeeData.profile_picture);
                }
                
                await api.post("/api/employee/add/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            alert(`${formType === "department" ? "Department" : "Employee"} added successfully!`);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while saving. Please try again.");
        }
    };

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
                                required
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
                                required
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
                                required
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
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country ID</label>
                            <input
                                type="number"
                                id="country"
                                name="country"
                                value={employeeData.country || ""}
                                onChange={handleEmployeeChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={employeeData.city}
                                onChange={handleEmployeeChange}
                                required
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
                                required
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
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department_id">Department ID</label>
                            <input
                                type="number"
                                id="department_id"
                                name="department_id"
                                value={employeeData.department_id}
                                onChange={handleEmployeeChange}
                                required
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
                                required
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
                                required
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
                                required
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
                                required
                            />
                        </div>
                    </>
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

export default AddDepartEmpForm;