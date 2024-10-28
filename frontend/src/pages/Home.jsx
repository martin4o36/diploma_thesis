import { useEffect, useState } from "react";
import api from "../api";

function Home() {
    const [employee, setEmployee] = useState(null);
    const [department, setDepartment] = useState(null);

    useEffect(() => {
        const fetchEmployeeDepartmentData = async () => {
            try {
                const response = await api.get("/api/employee");
                setEmployee(response.data)

                if(response.data.department_id) {
                    const departmentResponse = await api.get(`/api/departments/${response.data.department_id}`);
                    setDepartment(departmentResponse.data);
                } else {
                    setDepartment(null);
                }
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        }

        fetchEmployeeDepartmentData();
    }, []);

    return <div>
        <h1>Welcome to the Employee Management System!</h1>
        {employee ? (
                <div>
                    <p>Your Employee ID: {employee.employee_id}</p>
                    <p>Name: {employee.first_name} {employee.last_name}</p>
                    <p>Position: {employee.position}</p>
                    <p>Department: {department ? department.dep_name : "No department"}</p>
                </div>
            ) : (
                <p>Loading employee information...</p>
            )}
    </div>
}

export default Home