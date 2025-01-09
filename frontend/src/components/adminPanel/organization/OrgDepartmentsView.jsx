import React, { useState, useEffect } from "react";
import "../../../styles/adminPanelStyles/departmentStyles/OrgDepartments.css";
import api from "../../../api";
import AddDepartmentForm from "./AddDepartmentForm";
import AddEmployeeForm from "./AddEmployee";
import EditDepartment from "./EditDepartment";
import EditEmployee from "./EditEmployee";
import { Trash2, Edit2, Plus, User, Building2 } from "lucide-react";

function OrgDepartmentsView({ setSelectedContent }) {
    const [departments, setDepartments] = useState([]);
    const [employeesNoDepartment, setEmployeesNoDepartment] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [employeesByDepartment, setEmployeesByDepartment] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [currentEntity, setCurrentEntity] = useState(null);

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
        console.log(employeesNoDepartment);
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

    const handleAction = (action, entity) => {
        setCurrentAction(action);
        setCurrentEntity(entity);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentAction(null);
        setCurrentEntity(null);
    };

    const refreshEmployees = (oldDepartmentId, newDepartmentId) => {
        fetchEmployeesWithNoDepartment();
        
        if (oldDepartmentId && oldDepartmentId !== newDepartmentId) {
            fetchEmployeesByDepartment(oldDepartmentId);
        }

        if (newDepartmentId) {
            fetchEmployeesByDepartment(newDepartmentId);
        }
    };

    const refreshDepartments = () => {
        fetchDepartments();
        fetchEmployeesWithNoDepartment();
    }

    const handleDeleteDepartment = async (departmentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this department and his child departments?");

        if(confirmDelete) {
            try {
                await api.delete(`/api/departments/${departmentId}/delete/`)
                refreshDepartments();
            } catch (error) {
                console.error("Error deleting department:", error);
            }
        }
    };

    const handleDeleteEmployee = async (employee) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this employee?");

        if(confirmDelete) {
            try {
                await api.delete(`/api/employee/${employee.employee_id}/delete/`)
                refreshEmployees(employee.department_id);
            } catch (error) {
                console.error("Error deleting department:", error);
            }
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
                    <div className="department-actions">
                        <button
                            onClick={(e) => e.stopPropagation() || handleAction("addDepartment", node)}
                            className="add-department-button"
                            title="Add Sub-department"
                        >
                            <Plus className="department-plus-icon" />
                            <Building2 />
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation() || handleAction("editDepartment", node)}
                            className="edit-department-button"
                            title="Edit Department"
                        >
                            <Edit2 className="department-edit-icon" />
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation() || handleDeleteDepartment(node.key)}
                            className="delete-department-button"
                            title="Delete Department"
                        >
                            <Trash2 className="department-trash-icon" />
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation() || handleAction("addEmployee", node)}
                            className="add-employee-button"
                            title="Add Employee"
                        >
                            <Plus className="employee-plus-icon" />
                            <User />
                        </button>
                    </div>
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
                                    <div className="employee-actions">
                                        <button
                                            onClick={(e) => e.stopPropagation() || handleAction("editEmployee", employee)}
                                            className="edit-employee-button"
                                            title="Edit Employee"
                                        >
                                            <Edit2 className="employee-edit-icon" />
                                        </button>
                                        <button
                                            onClick={(e) => e.stopPropagation() || handleDeleteEmployee(employee)}
                                            className="delete-employee-button"
                                            title="Delete Employee"
                                        >
                                            <Trash2 className="employee-trash-icon" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="treeview-container">
            <div className="actions-bar">
                <button onClick={() => handleAction("addDepartment", null)} className="main-add-department-button" aria-label="Add department">
                    <Plus className="main-department-plus-icon" /> Add Department
                </button>
                <button onClick={() => handleAction("addEmployee", null)} className="main-add-employee-button" aria-label="Add employee">
                    <Plus className="main-employee-plus-icon" /> Add Employee
                </button>
            </div>

            <ul>
                {employeesNoDepartment.map((employee) => (
                    <li key={employee.employee_id} className="employee-item">
                        {employee.first_name} {employee.last_name} ({employee.position})
                        <div className="employee-actions">
                            <button
                                onClick={(e) => e.stopPropagation() || handleAction("editEmployee", employee)}
                                className="edit-employee-button"
                                title="Edit Employee"
                            >
                                <Edit2 className="employee-edit-icon" />
                            </button>
                            <button
                                onClick={(e) => e.stopPropagation() || handleDeleteEmployee(employee)}
                                className="delete-employee-button"
                                title="Delete Employee"
                            >
                                <Trash2 className="employee-trash-icon" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <ul className="treeview-list">
                {departments.map((dept) => renderTree(dept))}
            </ul>

            {showModal && (
                <div className="modal-overlay">
                    <div>
                        {currentAction === "addDepartment" && (
                            <AddDepartmentForm 
                                department={currentEntity} 
                                onClose={closeModal}
                                refreshData={refreshDepartments}
                            />
                        )}
                        {currentAction === "editDepartment" && (
                            <EditDepartment 
                                department={currentEntity} 
                                onClose={closeModal}
                                refreshData={refreshDepartments}
                            />
                        )}
                        {currentAction === "addEmployee" && (
                            <AddEmployeeForm 
                                department={currentEntity} 
                                onClose={closeModal} 
                                setSelectedContent={setSelectedContent}
                                refreshEmployees={refreshEmployees}
                            />
                        )}
                        {currentAction === "editEmployee" && (
                            <EditEmployee 
                                employee={currentEntity} 
                                onClose={closeModal}
                                refreshEmployees={refreshEmployees}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrgDepartmentsView;
