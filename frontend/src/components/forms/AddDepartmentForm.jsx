import { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/AddDepartmentStyles.css"

function AddDepartmentForm() {
    const [name, setName] = useState("");
    const [parentDept, setParentDept] = useState(0);
    const [departments, setDepartments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get("/api/departments/");
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!name) {
            setErrorMessage("Department name is required.");
            return;
        }

        try {
            const response = await api.post("/api/add_department/", {
                dep_name: name.trim(),
                parent_dept_id: parentDept !== 0 ? parentDept : 0,
            });

            if(response.status === 201) {
                setSuccessMessage("Department added successfully!");
                setName("");
                setParentDept(0);
                setErrorMessage("");
            }
        } catch (error) {
            console.log("Error adding department:", error)
            setErrorMessage("Failed to add department. Please try again.");
        }

        console.log({ name, parentDept });
    };

    return (
        <div className="add-department-container">
            <h1 className="form-title">Add Department</h1>

            <label htmlFor="dept-name" className="form-label">Department Name:</label>
            <input
                id="dept-name"
                className="dept-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter department name"
                required
            />

            <label htmlFor="parent-dept" className="form-label">Parent Department:</label>
            <select
                id="parent-dept"
                className="dept-select-input"
                value={parentDept}
                onChange={(e) => setParentDept(e.target.value)}
                required
            >
                <option value="0">None</option>
                {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                        {dept.dep_name}
                    </option>
                ))}
            </select>

            <div className="parent-department">
                <span>Parent Department:</span>{" "}
                <span className="parent-department-name">
                    {parentDept === 0
                        ? "None"
                        : departments.find((d) => d.department_id === parseInt(parentDept))?.dep_name}
                </span>
            </div>

            <button onClick={handleSubmit} className="submit-btn">
                Submit
            </button>
        </div>
    );
}

export default AddDepartmentForm;