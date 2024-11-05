import { useEffect, useState } from "react";
import api from "../api";
import Menu from "../components/homeMenu/Menu";
import WorkCalendar from "../components/calendar/CalendarTest";

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
        <div>
            <Menu />
        </div>

        {/* <div>
            <WorkCalendar />
        </div> */}

    </div>
}

export default Home