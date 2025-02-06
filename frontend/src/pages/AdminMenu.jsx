import React, { useState } from "react";
import { Users, Calendar, Flag, User, MenuIcon } from "lucide-react";
import logo from "../assets/logo.jpg";
import "../styles/SidebarStyles.css";
import OrgDepartmentsView from "../components/adminPanel/organization/OrgDepartmentsView";
import LeaveTypesView from "../components/adminPanel/leaveTypes/LeaveTypesView";
import CountriesView from "../components/adminPanel/countries/CountriesView";
import EmployeeDetailsView from "../components/adminPanel/employeeDetails/EmployeeDetailsView";

function AdminMenu() {
    const menuItems = [
        { icon: Users, label: "Employees and Departments" },
        { icon: Calendar, label: "Leave Types" },
        { icon: Flag, label: "Countries" },
        { icon: User, label: "Employee Holiday Details" },
    ];

    const [selectedContent, setSelectedContent] = useState(menuItems[0].label);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleMenuClick = (itemLabel) => {
        setSelectedContent(itemLabel);
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="admin-nav-area">
            <div className={`custom-sidebar ${isExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
                <div className="custom-sidebar-header">
                    <img
                        src={logo}
                        alt="Logo"
                        className="custom-sidebar-logo"
                    />
                    <button
                        onClick={toggleSidebar}
                        className="custom-toggle-button"
                    >
                        <MenuIcon />
                    </button>
                </div>
                <nav className="custom-sidebar-nav">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            className={`custom-sidebar-item ${selectedContent === item.label ? "item-active" : ""}`}
                            onClick={() => handleMenuClick(item.label)}
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

            <div className={`main-content ${isExpanded ? "expanded" : "collapsed"}`}>
                {selectedContent === "Employees and Departments" && <OrgDepartmentsView setSelectedContent={setSelectedContent} />}
                {selectedContent === "Leave Types" && <LeaveTypesView />}
                {selectedContent === "Countries" && <CountriesView />}
                {selectedContent === "Employee Holiday Details" && <EmployeeDetailsView />}
            </div>
        </div>
    );
}

export default AdminMenu;