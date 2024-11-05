import Dropdown from "./Dropdown";
import { useState } from "react";
import { Link } from 'react-router-dom';
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
                    <Dropdown subMenus={items.subMenu} dropdown={dropdown} menuTitle={items.title} />
                </>
            ) : (
                <Link to={`/${items.title.toLowerCase().replace(/\s+/g, '-')}`}>{items.title}</Link>
            )}
        </li>
    );
};

export default MenuItems;
