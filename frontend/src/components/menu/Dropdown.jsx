import "../../styles/MenuStyles.css";

const Dropdown = ({subMenus, dropdown}) => {
    return (
        <ul className={`dropdown ${dropdown ? "show" : ""}`}>
            {subMenus.map((subMenu, index) => (
                <li className="menu-items" key={index}>
                    <a href="/#">{subMenu.title}</a>
                </li>
            ))}
        </ul>
    );
}

export default Dropdown