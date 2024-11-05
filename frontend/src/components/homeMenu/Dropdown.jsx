import "../../styles/MenuStyles.css";
import { Link } from 'react-router-dom';

const Dropdown = ({ subMenus, dropdown, menuTitle }) => {
    return (
        <ul className={`dropdown ${dropdown ? "show" : ""}`}>
            {subMenus.map((subMenu, index) => (
                <li className="menu-items" key={index}>
                    <Link to={`/${menuTitle.toLowerCase().replace(/\s+/g, '-')}/${subMenu.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        {subMenu.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default Dropdown;
