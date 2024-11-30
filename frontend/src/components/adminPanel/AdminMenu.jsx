import React, { useState, useEffect } from "react";
import "../../styles/adminPanelStyles/AdminMenu.css";
import OrgDepartmentsView from "./OrgDepartmentsView";
import LeaveTypesView from "./LeaveTypesView";
import RequestsStatistics from "./RequestsStatistics";

function AdminMenu() {
    const menuItems = [
        { title: "Employees and Departments" },
        { title: "Leave Types" },
        { title: "Employee Vacation Balances" },
        { title: "Employee Allowances" },
        { title: "Request Statistics" },
    ];

    const [selectedContent, setSelectedContent] = useState(menuItems[0].title);
    const [collapsed, setCollapsed] = useState(false);

    const handleMenuClick = (itemTitle) => {
        setSelectedContent(itemTitle);
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="admin-nav-area">
            <div className={`admin-nav ${collapsed ? "collapsed" : ""}`}>
                <button className="toggle-menu-btn" onClick={toggleSidebar}>⇔</button>
                <nav className="main-nav">
                    <ul className="menus">
                        {menuItems.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-items ${selectedContent === item.title ? "active" : ""}`}
                                onClick={() => handleMenuClick(item.title)}
                            >
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="content-area">
                {selectedContent === "Employees and Departments" && <OrgDepartmentsView /> }
                {selectedContent === "Leave Types" && <LeaveTypesView /> }
                {selectedContent === "Requests" && <RequestsStatistics /> }
            </div>
        </div>
    );
}

export default AdminMenu;
