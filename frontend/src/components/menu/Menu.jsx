import { MenuItemsProvider } from "./MenuItemsData";
import logo from "../../assets/logo.jpg";
import "../../styles/MenuStyles.css";
import MenuItems from "./MenuItems"

function Menu() {return(
        <MenuItemsProvider>
            {menuItems => (
                <div className="nav-area">
                    <img src={logo} className="logo" alt="StaffSync"/>
                    
                    <nav className="main-nav">
                        <ul className="menus">
                            {menuItems.map((menu, index) => (
                                <MenuItems items={menu} key={index} />
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </MenuItemsProvider>
    );
}

export default Menu;