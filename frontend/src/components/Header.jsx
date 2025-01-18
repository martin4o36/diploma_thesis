import React from "react";
import { Bell } from "lucide-react";
import ProfileElement from "./ProfileElement";
import "../styles/HeaderStyles.css";

function Header({ onProfileClick }) {
    return (
        <header className="header-container">
            <div className="left-side">
                <button className="bell-icon">
                    <Bell className="bell-icon-svg" />
                    <span className="notification-badge"></span>
                </button>
            </div>

            <div className="right-side">
                <ProfileElement onClick={onProfileClick} />
            </div>
        </header>
    );
}

export default Header;