import { useState, useEffect } from "react";
import api from "../api";
import { InfoIcon } from "lucide-react"

function ContactsAndOrg() {
    const [departments, setDepartments] = useState([]);
    const [employeesNoDepartment, setEmployeesNoDepartment] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [employeesByDepartment, setEmployeesByDepartment] = useState({});

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/api/departments/chart/");
            setDepartments(response.data);
        } catch (error) {
            console.log("Error fetching departments:", error);
        }
    };

    const fetchEmployeesWithNoDepartment = async () => {
        try {
            const response = await api.get("/api/employee/no-department/");
            setEmployeesNoDepartment(response.data);
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching employees with no department:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchEmployeesWithNoDepartment();
    }, []);

    const fetchEmployeesByDepartment = async (departmentId) => {
        try {
            const response = await api.get(`/api/employee/${departmentId}/by-department/`);
            setEmployeesByDepartment((prev) => ({
                ...prev,
                [departmentId]: response.data,
            }));
        } catch (error) {
            console.log(`Error fetching employees for department ${departmentId}:`, error);
        }
    };

    const toggleExpand = (nodeId) => {
        setExpanded((prev) => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }));

        if (!expanded[nodeId]) {
            fetchEmployeesByDepartment(nodeId);
        }
    };

    const renderTree = (node, level = 0) => {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;
        const employees = employeesByDepartment[node.key] || [];
        const isExpanded = expanded[node.key];

        return (
            <li key={node.key} className="treeview-item" style={{ marginLeft: `${level * 20}px` }}>
                <div className="tree-title" onClick={() => toggleExpand(node.key)}>
                    <i className={`fa ${isExpanded ? "fa-angle-down" : "fa-angle-right"}`} />
                    {node.title}
                </div>

                {isExpanded && (
                    <ul className="children">
                        {hasChildren &&
                            node.children.map((child) => renderTree(child, level + 1))}

                        {employees.length === 0 && !hasChildren && (
                            <li className="empty-item">No departments or employees found</li>
                        )}

                        {employees.length > 0 &&
                            employees.map((employee) => (
                                <li key={employee.employee_id} className="employee-item">
                                    {employee.first_name} {employee.last_name} ({employee.position})
                                </li>
                            ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="treeview-container">
            <ul>
                {employeesNoDepartment.map((employee) => (
                    <li key={employee.employee_id} className="employee-item">
                        {employee.first_name} {employee.last_name} ({employee.position})
                        <div className="employee-actions">
                        </div>
                    </li>
                ))}
            </ul>

            <ul className="treeview-list">
                {departments.map((dept) => renderTree(dept))}
            </ul>
        </div>
    );
}

export default ContactsAndOrg;