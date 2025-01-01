import React, { useState, useEffect } from "react";
import "../../../styles/adminPanelStyles/departmentStyles/OrgDepartments.css";
import api from "../../../api";
import AddDepartmentForm from "./AddDepartmentForm";
import AddEmployeeForm from "./AddEmployeeForm";
import EditDepartment from "./EditDepartment";
import EditEmployee from "./EditEmployee";
import { Trash2, Edit2, Plus, User, Building2 } from "lucide-react";

function OrgDepartmentsView() {
    const [departments, setDepartments] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [employeesByDepartment, setEmployeesByDepartment] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [currentEntity, setCurrentEntity] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get("/api/departments/chart/");
                setDepartments(response.data);
            } catch (error) {
                console.log("Error fetching departments:", error);
            }
        };

        fetchDepartments();
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

    const handleDeleteDepartment = async (department) => {
        try {
            console.log(department.key);
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    const handleDeleteEmployee = async (employee) => {
        try {
            console.log(employee.employee_id);
        } catch (error) {
            console.error("Error deleting employee:", error);
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
                            onClick={(e) => e.stopPropagation() || handleAction("editDepartment", node)}
                            className="action-button"
                            title="Edit Department"
                        >
                            <Edit2 />
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation() || handleDeleteDepartment(node)}
                            className="action-button"
                            title="Delete Department"
                        >
                            <Trash2 />
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation() || handleAction("addEmployee", node)}
                            className="action-button"
                            title="Add Employee"
                        >
                            <Plus />
                            <User />
                        </button>
                        <button
                            onClick={(e) => e.stopPropagation() || handleAction("addDepartment", node)}
                            className="action-button"
                            title="Add Sub-department"
                        >
                            <Plus />
                            <Building2 />
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
                                            title="Edit Employee"
                                        >
                                            <Edit2 />
                                        </button>
                                        <button
                                            onClick={(e) => e.stopPropagation() || handleDeleteEmployee(employee)}
                                            title="Delete Employee"
                                        >
                                            <Trash2 />
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
                <button onClick={() => handleAction("addDepartment", null)} className="action-button primary">
                    <Plus /> Add Department
                </button>
                <button onClick={() => handleAction("addEmployee", null)} className="action-button secondary">
                    <Plus /> Add Employee
                </button>
            </div>

            <ul className="treeview-list">
                {departments.map((dept) => renderTree(dept))}
            </ul>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {currentAction === "addDepartment" && (
                            <AddDepartmentForm department={currentEntity} onClose={closeModal} />
                        )}
                        {currentAction === "editDepartment" && (
                            <EditDepartment department={currentEntity} onClose={closeModal} />
                        )}
                        {currentAction === "addEmployee" && (
                            <AddEmployeeForm department={currentEntity} onClose={closeModal} />
                        )}
                        {currentAction === "editEmployee" && (
                            <EditEmployee employee={currentEntity} onClose={closeModal} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrgDepartmentsView;
