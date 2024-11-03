import Dropdown from "./Dropdown"
import { useState } from "react";
import "../../styles/MenuStyles.css";

const MenuItems = ({ items }) => {
    const [dropdown, setDropdown] = useState(false);

    return (
        <li className="menu-items">
            {items.subMenu ? (
                <>
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={dropdown ? "true" : "false"}
                        onClick={() => setDropdown(prev => !prev)}
                    >
                        {items.title} {" "}
                    </button>
                    <Dropdown subMenus={items.subMenu} dropdown={dropdown} />
                </>
            ) : (
                <a href="/#">{items.title}</a>
            )}
        </li>
    );
};

export default MenuItems;