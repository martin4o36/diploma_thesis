import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import logo from "../../assets/logo.jpg";
import "../../styles/MenuStyles.css";
import { defaultMenuItems } from "./MenuItemsData";
import ProfileElement from "./ProfileElement";

function Menu() {
    const [menuItems, setMenuItems] = useState(defaultMenuItems);

    useEffect(() => {
        const fetchDataForMenu = async () => {
            try {
                const permissionsResponse = await api.get("/api/user-permissions/");

                setMenuItems(prevItems => {
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
                    {menuItems.map((item, index) => (
                        <li className="menu-items" key={index}>
                            <Link to={item.path}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <ProfileElement />
        </div>
    );
}

export default Menu;