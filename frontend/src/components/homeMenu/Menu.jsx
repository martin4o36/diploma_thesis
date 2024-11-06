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
        const fetchLeaveTypes = async () => {
            try {
                const response = await api.get("/api/leave_types/");
                const leaveTypes = response.data.map(type => ({ title: type.leave_name }));

                setMenuItems(prevItems =>
                    prevItems.map(item =>
                        item.title === "Vacation" ? { ...item, subMenu: leaveTypes } : item
                    )
                );
            } catch (error) {
                console.error("Error fetching leave types:", error);
            }
        };

        fetchLeaveTypes();
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