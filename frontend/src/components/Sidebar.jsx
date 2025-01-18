import React, { useState } from "react";
import { Home, Users, Calendar, Monitor, Settings, MenuIcon } from "lucide-react";
import logo from "../assets/logo.jpg";
import "../styles/SidebarStyles.css";

function Sidebar({ hasAdminPermission, activeTab, setActiveTab }) {
	const [isExpanded, setIsExpanded] = useState(true);

	const menuItems = [
        { icon: Home, label: "Home" },
        { icon: Users, label: "Contacts and Organization" },
        { icon: Calendar, label: "Time Off Requests" },
        { icon: Monitor, label: "Remote Work" },
        ...(hasAdminPermission ? [{ icon: Settings, label: "Admin" }] : []),
    ];

	return (
        <div className={`custom-sidebar ${isExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
            <div className="custom-sidebar-header">
                <img
                    src={logo}
                    alt="Logo"
                    className="custom-sidebar-logo"
                />
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="custom-toggle-button"
                >
                    <MenuIcon />
                </button>
            </div>
            <nav className="custom-sidebar-nav">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        className={`custom-sidebar-item ${activeTab === item.label ? "item-active" : ""}`}
                        onClick={() => setActiveTab(item.label)}
                    >
                        <item.icon className="custom-sidebar-icon" />
                        <span
                            className={`custom-sidebar-label ${isExpanded ? "label-expanded" : "label-collapsed"}`}
                        >
                            {item.label}
                        </span>
                    </a>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
