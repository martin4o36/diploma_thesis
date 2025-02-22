import CalendarView from "./components/CalendarView";
import PendingApprovals from "./components/PendingApprovals";
import HolidayRequests from "../holiday_reqeusts/HolidayRequests";
import RemoteWorkRequests from "../remote_requests/RemoteWorkRequests";
import ContactsAndOrg from "../pages/ContactsAndOrg";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EmployeePersonalDetails from "./components/EmployeePersonalDetails";
import SelfServicePortal from "../self_service/SelfServicePortal";
import "../styles/HomeStyles.css"
import { ChevronLeft, ChevronRight, Check, X, Users, HomeIcon, Calendar, UserCog, MonitorIcon } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
    const [employee, setEmployee] = useState(null);
    const [hasAdminPermission, setHasAdminPermission] = useState(false);
    const [hasManagerPermission, setHasManagerPermission] = useState(false);
    const [activeTab, setActiveTab] = useState("Home");
    const [showProfile, setShowProfile] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRolesForMenu = async () => {
            try {
                const response = await api.get("/api/employee/");
                setEmployee(response.data);

                if(response.data.roles.includes("Owner") || response.data.roles.includes("HR")) {
                    setHasAdminPermission(true);
                }

                if(response.data.roles.includes("Manager") || response.data.roles.includes("Owner")) {
                    setHasManagerPermission(true);
                }
            } catch (error) {
                console.error("Error fetching user roles:", error);
            }
        };

        fetchRolesForMenu();
    }, []);

    const renderActiveView = () => {
        if (!employee) {
            return <p>Loading...</p>;
        }

        switch (activeTab) {
            case "Contacts and Organization":
                return <ContactsAndOrg />;
            case "Time Off":
                return <HolidayRequests employee={employee} />;
            case "Remote Work":
                return <RemoteWorkRequests employee={employee} />;
            case "Admin":
                navigate("/admin_panel");
            case "Self Service":
                return <SelfServicePortal employee={employee}/>
            case "Home":
            default:
                return (
                    <div className="dashboard-layout">
                        <CalendarView employee={employee} />

                        <div className="requests-panel">
                            <PendingApprovals 
                                employee={employee} 
                                hasManagerPermission={hasManagerPermission} 
                            />
                        </div>
                    </div>
                );
        }
    };

    const openProfileModal = () => {
        setShowProfile(true);
    };

    const closeProfileModal = () => {
        setShowProfile(false);
    };

    return (
        <div className="home-container">
            <Sidebar
                hasAdminPermission={hasAdminPermission}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
            />

            <Header onProfileClick={openProfileModal} />

            {showProfile && (
                <>
                    <EmployeePersonalDetails
                        employee={employee}
                        onClose={closeProfileModal}
                    />
                </>
            )}

            <div 
                className={`main-content ${isSidebarExpanded ? "expanded" : "collapsed"}`}
            >
                {renderActiveView()}
            </div>
        </div>
    );
}

export default Home