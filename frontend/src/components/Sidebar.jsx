import React, { useState, useEffect } from "react";
import { Home, Users, Calendar, Monitor, Settings, MenuIcon, User, Flag, ChevronDown, ChevronUp } from "lucide-react";
import logo from "../assets/logo.jpg";
import "../styles/SidebarStyles.css";

function Sidebar({ hasAdminPermission, activeTab, setActiveTab, isExpanded, setIsExpanded }) {
    const [adminExpanded, setAdminExpanded] = useState(false);
    const [selectedContent, setSelectedContent] = useState(activeTab);

	const mainMenuItems = [
        { icon: Home, label: "Home" },
        { icon: Users, label: "Contacts and Organization" },
        { icon: Calendar, label: "Time Off" },
        { icon: Monitor, label: "Remote Work" },
        { icon: User, label: "Self Service" },
    ];

    const adminMenuItems = [
        { icon: Users, label: "Employees and Departments" },
        { icon: Calendar, label: "Leave Types" },
        { icon: Flag, label: "Countries" },
        { icon: User, label: "Employee Holiday Details" },
    ];

    useEffect(() => {
        setSelectedContent(activeTab);
    }, [activeTab]);

    const handleTabClick = (label) => {
        if (label === "Admin") {
            setAdminExpanded(!adminExpanded);
        } else {
            setSelectedContent(label);
            setActiveTab(label);
        }
    };

	return (
        <div className="admin-nav-area">
            <div className={`custom-sidebar ${isExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
                <div className="custom-sidebar-header">
                    <img src={logo} alt="Logo" className="custom-sidebar-logo" />
                    <button onClick={() => setIsExpanded(!isExpanded)} className="custom-toggle-button">
                        <MenuIcon />
                    </button>
                </div>
                <nav className="custom-sidebar-nav">
                    {mainMenuItems.map((item) => (
                        <a
                            key={item.label}
                            className={`custom-sidebar-item ${selectedContent === item.label ? "item-active" : ""}`}
                            onClick={() => handleTabClick(item.label)}
                        >
                            <item.icon className="custom-sidebar-icon" />
                            <span className={`custom-sidebar-label ${isExpanded ? "label-expanded" : "label-collapsed"}`}>{item.label}</span>
                        </a>
                    ))}
                    {hasAdminPermission && (
                        <div className="custom-sidebar-admin">
                            <a
                                className={`custom-sidebar-item ${adminExpanded ? "item-active" : ""}`}
                                onClick={() => handleTabClick("Admin")}
                            >
                                <Settings className="custom-sidebar-icon" />
                                <span className={`custom-sidebar-label ${isExpanded ? "label-expanded" : "label-collapsed"}`}>Admin Panel</span>
                                {isExpanded && (adminExpanded ? <ChevronUp className="chevron-icon" /> : <ChevronDown className="chevron-icon" />)}
                            </a>
                            {adminExpanded && isExpanded && (
                                <div className="admin-submenu">
                                    {adminMenuItems.map((item) => (
                                        <a
                                            key={item.label}
                                            className={`custom-sidebar-item admin-item ${selectedContent === item.label ? "item-active" : ""}`}
                                            onClick={() => handleTabClick(item.label)}
                                        >
                                            <item.icon className="custom-sidebar-icon" />
                                            <span className="custom-sidebar-label">{item.label}</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;
