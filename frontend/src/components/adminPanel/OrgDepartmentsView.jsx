import React, { useState, useEffect } from "react";
import "../../styles/OrgDepartments.css";
import api from "../../api";

function OrgDepartmentsView() {
    const [departments, setDepartments] = useState([]);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get("/api/departments_chart/");
                setDepartments(response.data);
            } catch (error) {
                console.log("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    const toggleExpand = (nodeId) => {
        setExpanded((prev) => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }));
    };

    const handleDepartmentAction = async (action, department) => {
        switch (action) {
            case "viewEmployees":
                console.log("View employees for:", department);
                break;
            case "addSubDepartment":
                console.log("Add sub-department for:", department);
                break;
            case "edit":
                console.log("Edit department:", department);
                break;
            case "delete":
                console.log("Delete department:", department);
                break;
            default:
                console.log("Unknown action:", action);
                break;
        }
    };

    const renderTree = (node, level = 0) => {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;

        return (
            <li key={node.key} className="treeview-item" style={{ marginLeft: `${level * 20}px` }}>
                <div
                    className={`tree-title ${expanded[node.key] ? "expanded" : "collapsed"}`}
                    onClick={() => hasChildren && toggleExpand(node.key)}
                >
                    {hasChildren && (expanded[node.key] ? "-" : "+")} {node.title}
                </div>
                <div className="department-actions">
                    <button onClick={() => handleDepartmentAction("viewEmployees", node)}>View Employees</button>
                    <button onClick={() => handleDepartmentAction("addSubDepartment", node)}>Add Sub-Department</button>
                    <button onClick={() => handleDepartmentAction("edit", node)}>Edit</button>
                    <button onClick={() => handleDepartmentAction("delete", node)}>Delete</button>
                </div>
                {expanded[node.key] && hasChildren && (
                    <ul className="children">
                        {node.children.map((child) => renderTree(child, level + 1))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="treeview-container">
            <ul className="treeview-list">
                {departments.map((dept) => renderTree(dept))}
            </ul>
        </div>
    );
}

export default OrgDepartmentsView;
