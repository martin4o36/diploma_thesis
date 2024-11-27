import React, { useState, useEffect } from "react";
import "../../styles/AdminMenu.css";
import OrgDepartmentsView from "./OrgDepartmentsView";
import api from "../../api";

function AdminMenu() {
    const menuItems = [
        { title: "Employees and Departments" },
        { title: "Leave Types" },
        { title: "Requests" },
        { title: "Employee Vacation Balances" },
        { title: "Employee Allowances" },
    ];

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get("/api/departments_chart/");
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
            }
    };

        fetchDepartments();
    }, []);

    const [selectedContent, setSelectedContent] = useState("");

    useEffect(() => {
        setSelectedContent(menuItems[0].title);
    }, []);

    const handleMenuClick = (itemTitle) => {
        setSelectedContent(itemTitle);
    };

    return (
      <div className="admin-nav-area">
        <div className="admin-nav">
          <div className="logo">Admin Panel</div>
  
          <nav className="main-nav">
            <ul className="menus">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="menu-items"
                  onClick={() => handleMenuClick(item.title)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </nav>
        </div>
  
        <div className="content-area">
          {selectedContent === "Employees and Departments" && (
            <OrgDepartmentsView departments={departments}/>
          )}
        </div>
      </div>
    );   
}

export default AdminMenu;
