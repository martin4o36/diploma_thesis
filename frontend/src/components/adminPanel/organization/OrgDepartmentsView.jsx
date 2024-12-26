import React, { useState, useEffect } from "react";
import "../../../styles/adminPanelStyles/departmentStyles/OrgDepartments.css";
import api from "../../../api";
import AddDeptEmpForm from "./AddDeptEmpForm";
import { Trash2, Edit2, Plus, User, Building2 } from "lucide-react"; 

function OrgDepartmentsView() {
    const [departments, setDepartments] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [employeesByDepartment, setEmployeesByDepartment] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);

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
            const response = await api.post("/api/employee/by-department/", { department_id: departmentId });
            setEmployeesByDepartment((prev) => ({
                ...prev,
                [departmentId]: response.data,
            }));
        } catch (error) {
            console.log(`Error fetching employees for department ${departmentId}:`, error);
        }
    }

    const toggleExpand = (nodeId) => {
        setExpanded((prev) => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }));

        if (!expanded[nodeId]) {
            fetchEmployeesByDepartment(nodeId);
        }
    };

    const handleDepartmentAction = async (action, department) => {
        switch (action) {
            case "addDepartment":
                setCurrentDepartment(department);
                setShowModal(true);
                break;
            case "edit":
                console.log("Edit department:", department);
                break;
            case "delete":
                console.log("Delete department:", department);
                break;
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentDepartment(null);
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
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDepartmentAction("addDepartment", node);
                            }}
                        >
                            <i className="fa fa-plus" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDepartmentAction("edit", node);
                            }}
                        >
                            <i className="fa fa-pencil" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDepartmentAction("delete", node);
                            }}
                        >
                            <i className="fa fa-trash" />
                        </button>
                    </div>
                </div>
    
                {isExpanded && (
                    <ul className="children">
                        {hasChildren
                            ? node.children.map((child) => renderTree(child, level + 1))
                            : null}
    
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
            <div className="actions-bar">
                <button onClick={() => setShowModal(true)} className="action-button">
                    Add Department
                </button>
                <button onClick={() => setShowModal(true)} className="action-button">
                    Add Employee
                </button>
            </div>

            <ul className="treeview-list">
                {departments.map((dept) => renderTree(dept))}
            </ul>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AddDeptEmpForm
                            department={currentDepartment}
                            onClose={closeModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrgDepartmentsView;
