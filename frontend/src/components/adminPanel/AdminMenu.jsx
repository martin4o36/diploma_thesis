import React, { useState } from "react";
import "../../styles/adminPanelStyles/AdminMenu.css";
import OrgDepartmentsView from "./organization/OrgDepartmentsView";
import LeaveTypesView from "./leaveTypes/LeaveTypesView";
import CountriesView from "./countries/CountriesView";
import EmployeeDetailsView from "./employee_details/EmployeeDetailsView";

function AdminMenu() {
    const menuItems = [
        { title: "Employees and Departments" },
        { title: "Leave Types" },
        { title: "Countries" },
        { title: "Employee Holiday Details" },
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
                {selectedContent === "Employees and Departments" && <OrgDepartmentsView setSelectedContent={setSelectedContent} /> }
                {selectedContent === "Leave Types" && <LeaveTypesView /> }
                {selectedContent === "Countries" && <CountriesView /> }
                {selectedContent === "Employee Holiday Details" && <EmployeeDetailsView /> }
            </div>
        </div>
    );
}

export default AdminMenu;
