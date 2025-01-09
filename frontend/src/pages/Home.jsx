import CalendarView from "../components/home/CalendarView";
import PendingApprovals from "../components/home/PendingApprovals";
import ProfileElement from "../components/home/ProfileElement";
import "../styles/HomeStyles.css"
import { ChevronLeft, ChevronRight, Check, X, Users, HomeIcon, Calendar, UserCog } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api";
import logo from "../assets/logo.jpg"

function Home() {
    const [hasAdminPermission, setHasAdminPermission] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    const [showHoldaiyRequests, setShowHoldaiyRequests] = useState(false);
    const [showRemoteWorkRequests, setRemoteWorkRequests] = useState(false);

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

    return <div>
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
                        <li
                            className="menu-item"
                            // onClick={() => } // show contacts and organization
                        >
                            <Users /> {isMenuExpanded && "Contacts and Organization"}
                        </li>
                        <li
                            className="menu-item"
                            // onClick={() => } // show holiday requests
                        >
                            <Calendar /> {isMenuExpanded && "Time Off Requests"}
                        </li>
                        <li
                            className="menu-item"
                            // onClick={() => } // show remote work
                        >
                            <HomeIcon /> {isMenuExpanded && "Remote Work"}
                        </li>
                        {hasAdminPermission && (
                        <li
                            className="menu-item"
                            // onClick={() => } // navigate to /admin_panel
                        >
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

        <div>
            <CalendarView />
        </div>

        <div>
            <PendingApprovals />
        </div>

    </div>
}

export default Home