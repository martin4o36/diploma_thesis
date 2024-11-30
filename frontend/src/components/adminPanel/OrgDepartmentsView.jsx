import React, { useState, useEffect } from "react";
import "../../styles/adminPanelStyles/OrgDepartments.css";
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
            case "addDepartment":
                console.log("Add department for:", department);
                break;
            case "edit":
                console.log("Edit department:", department);
                break;
            case "delete":
                console.log("Delete department:", department);
                break;
        }
    };

    const renderTree = (node, level = 0) => {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    
        return (
            <li key={node.key} className="treeview-item" style={{ marginLeft: `${level * 20}px` }}>
                <div className="tree-title" onClick={() => hasChildren && toggleExpand(node.key)}>
                    {hasChildren && (
                        <i className={`fa ${expanded[node.key] ? "fa-angle-down" : "fa-angle-right"}`} style={{ marginRight: "8px" }}></i>
                    )}
                    {node.title}
                    <div className="department-actions">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDepartmentAction("addDepartment", node);
                            }}
                        >
                            <i className="fa fa-plus"></i>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDepartmentAction("edit", node);
                            }}
                        >
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDepartmentAction("delete", node);
                            }}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>
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
