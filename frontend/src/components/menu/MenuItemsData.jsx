import { useEffect, useState } from "react";
import api from "../../api";

export const defaultMenuItems = [
    { title: "Контакти и организация" },
    { title: "Отпуск", subMenu: [] },
    { title: "Работа от вкъщи", subMenu: [{ title: "Нова заявка" }, { title: "Мои заявка" }] },
    { title: "Мои заявки" },
    { title: "Профил" }
];

export const MenuItemsProvider = ({ children }) => {
    const [menuItems, setMenuItems] = useState(defaultMenuItems);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await api.get("/api/leave-types/");
                const leaveTypes = response.data.map(type => ({ title: type.leave_name }));

                setMenuItems(prevItems =>
                    prevItems.map(item =>
                        item.title === "Отпуск" ? { ...item, subMenu: leaveTypes } : item
                    )
                );
            } catch (error) {
                console.error("Error fetching leave types:", error);
            }
        };

        fetchLeaveTypes();
    }, []);

    return children(menuItems);
};