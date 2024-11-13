import { Link } from 'react-router-dom';
import "../../styles/MenuStyles.css";

const MenuItems = ({ items }) => {
    return (
        <li className="menu-items">
            <Link to={items.path}>{items.title}</Link>
        </li>
    );
};

export default MenuItems;
