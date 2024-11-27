import React, { useState } from "react";
import "../../styles/AdminMenu.css";

function OrgDepartmentsView({ departments }) {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (nodeId) => {
        setExpanded((prev) => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }));
    };

    const renderTree = (node) => {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;

        return (
            <li key={node.key} className="treeview-item">
                <div
                    className={`tree-title ${expanded[node.key] ? "expanded" : "collapsed"}`}
                    onClick={() => hasChildren && toggleExpand(node.key)}
                >
                    {hasChildren && (expanded[node.key] ? '[-]' : '[+]')} {node.title}
                </div>

                {expanded[node.key] && hasChildren && (
                    <ul className="children">
                        {node.children.map((child) => renderTree(child))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="treeview-container">
            <h3>Departments Tree</h3>
            <ul>
                {departments.map((dept) => renderTree(dept))}
            </ul>
        </div>
    );
}

export default OrgDepartmentsView;
