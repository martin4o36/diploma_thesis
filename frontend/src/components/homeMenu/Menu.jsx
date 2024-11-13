import { useEffect, useState } from "react";
import api from "../../api";
import logo from "../../assets/logo.jpg";
import "../../styles/MenuStyles.css";
import MenuItems from "./MenuItems";
import { defaultMenuItems } from "./MenuItemsData";
import ProfileElement from "./ProfileElement";

function Menu() {
    const [menuItems, setMenuItems] = useState(defaultMenuItems);

    useEffect(() => {
        const fetchDataForMenu = async () => {
            try {
                // Fetching leave types
                // const response = await api.get("/api/leave_types/");
                // const leaveTypes = response.data.map(type => ({ title: type.leave_name }));

                // Fetching user permissions for employee CRUD
                const permissionsResponse = await api.get("/api/user-permissions/");

                setMenuItems(prevItems => {
                    // const updatedMenuItems = prevItems.map(item =>
                    //     item.title === "Vacation" ? { ...item, subMenu: leaveTypes } : item
                    // );
                    const updatedMenuItems = [...prevItems];
                    const isEmployeesItemExists = updatedMenuItems.some(item => item.title === "Admin");
                    if (permissionsResponse.data.can_manage_employees && !isEmployeesItemExists) {
                        updatedMenuItems.push({ title: "Admin", path: "/admin_panel" });
                    }
    
                    return updatedMenuItems;
                });
            } catch (error) {
                console.error("Error fetching leave types:", error);
            }
        };

        fetchDataForMenu();
    }, []);


    return (
        <div className="nav-area">
            <img src={logo} className="logo" alt="StaffSync" />

            <nav className="main-nav">
                <ul className="menus">
                    {menuItems.map((menu, index) => (
                        <MenuItems items={menu} key={index} />
                    ))}
                </ul>
            </nav>
            <ProfileElement />
        </div>
    );
}

export default Menu;