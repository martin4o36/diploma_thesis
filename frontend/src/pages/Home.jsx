import CalendarView from "../components/home/CalendarView";
import PendingApprovals from "../components/home/PendingApprovals";
import ProfileElement from "../components/home/ProfileElement";
import HolidayRequests from "../components/home/requests/HolidayRequests";
import RemoteWorkRequests from "../components/home/requests/RemoteWorkRequests";
import ContactsAndOrg from "../components/home/ContactsAndOrg";
import "../styles/HomeStyles.css"
import { ChevronLeft, ChevronRight, Check, X, Users, HomeIcon, Calendar, UserCog, MonitorIcon } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api";
import logo from "../assets/logo.jpg"

function Home() {
    const [hasAdminPermission, setHasAdminPermission] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);
    const [activeView, setActiveView] = useState("home");

    useEffect(() => {
        const fetchRolesForMenu = async () => {
            try {
                const roles = (await api.get("/api/user/roles/")).data.roles;

                if(roles.includes("Owner") || roles.includes("HR")) {
                    setHasAdminPermission(true);
                }
            } catch (error) {
                console.error("Error fetching user roles:", error);
            }
        };

        fetchRolesForMenu();
    }, []);

    const toggleMenu = () => {
        setIsMenuExpanded(!isMenuExpanded);
    };

    const renderActiveView = () => {
        switch (activeView) {
            case "contacts":
                return <ContactsAndOrg />;
            case "holidayRequests":
                return <HolidayRequests />;
            case "remoteWorkRequests":
                return <RemoteWorkRequests />;
            case "home":
            default:
                return (
                    <>
                        <CalendarView />
                        <PendingApprovals />
                    </>
                );
        }
    };

    return <div>
        <div>
            <div className="nav-container">
                <div className="header">
                    <div className="logo-section">
                        <img src={logo} className="logo" alt="StaffSync" />
                    </div>
                    <div className="profile-element">
                        <ProfileElement />
                    </div>
                </div>

                <div className={`nav-area ${isMenuExpanded ? "expanded" : "collapsed"}`}>
                    <nav className="main-nav">
                        <ul className="menus">
                            <li className="menu-item" onClick={() => setActiveView("home")}>
                                <HomeIcon /> {isMenuExpanded && "Home"}
                            </li>
                            <li className="menu-item" onClick={() => setActiveView("contacts")}>
                                <Users /> {isMenuExpanded && "Contacts and Organization"}
                            </li>
                            <li className="menu-item" onClick={() => setActiveView("holidayRequests")}>
                                <Calendar /> {isMenuExpanded && "Time Off Requests"}
                            </li>
                            <li className="menu-item" onClick={() => setActiveView("remoteWorkRequests")}>
                                <MonitorIcon /> {isMenuExpanded && "Remote Work"}
                            </li>
                            {hasAdminPermission && (
                                <li className="menu-item" onClick={() => (window.location.href = "/admin_panel")}>
                                    <UserCog /> {isMenuExpanded && "Admin"}
                                </li>
                            )}
                        </ul>
                    </nav>
                    <button className="expand-btn" onClick={toggleMenu}>
                        {isMenuExpanded ? "<<" : ">>"}
                    </button>
                </div>
            </div>

            <div className={`content-scrollable ${isMenuExpanded ? "nav-expanded" : "nav-collapsed"}`}>
                {renderActiveView()}
            </div>
        </div>
    </div>
}

export default Home