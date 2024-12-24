import { useEffect, useState } from "react";
import api from "../../../api";

function EmployeeBalancesView() {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [balance, setBalance] = useState(null);
    const [allowances, setAllowances] = useState(null);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const response = await api.get("/api/employee/all/");
                setEmployees(response.data);
            } catch (error) {
                console.log("Error fetching employees:", error);
            }
        };

        fetchAllEmployees();
    }, []);

    const fetchDetails = async (employee_id) => {
        try {
            // Fetch Allowance
            const allowancesResponse = await api.get(`/api/allowance/${employee_id}/`);
            setAllowances(allowancesResponse.data);

            // Fetch Balance
            const balanceResponse = await api.get(`/api/balance/${employee_id}`);
            setBalance(balanceResponse.data);
        } catch (error) {
            console.error("Error fetching employee details:", error);
        }
    };

    const handleShowDetails = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
        setBalance(null);
        setAllowances(null);
        fetchDetails(employee.employee_id);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEmployee(null);
        setBalance(null);
        setAllowances(null);
    };

    return (
        <div>
            <h3>Employee Balances</h3>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.employee_id}>
                        <strong>
                            {employee.first_name} {employee.middle_name} {employee.last_name}
                        </strong>{" "}
                        - <em>{employee.position}</em>
                        <span
                            className="fa fa-info-circle"
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                            onClick={() => handleShowDetails(employee)}
                        ></span>
                    </li>
                ))}
            </ul>

            {showModal && selectedEmployee && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Employee Details</h4>
                        <p>
                            <strong>Name:</strong> {selectedEmployee.first_name}{" "}
                            {selectedEmployee.middle_name} {selectedEmployee.last_name}
                        </p>
                        <p>
                            <strong>Position:</strong> {selectedEmployee.position}
                        </p>

                        <h5>Allowance</h5>
                        {allowances ? (
                            <ul>
                                {allowances.map((allowance) => (
                                    <li key={allowance.allowance_id}>
                                            <strong>Leave Type:</strong> {allowance.leave_type} 
                                            <strong>Days:</strong> {allowance.days} 
                                            <strong>Period:</strong>{" "} 
                                            {allowance.period_start_date} to{" "} 
                                            {allowance.period_end_date}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Loading allowances...</p>
                        )}
                        <button onClick={handleCloseModal} className="close-modal-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeBalancesView;
