import CalendarView from "../components/home/CalendarView";
import PendingApprovals from "../components/home/PendingApprovals";
import HolidayRequests from "./HolidayRequests";
import RemoteWorkRequests from "./RemoteWorkRequests";
import ContactsAndOrg from "./ContactsAndOrg";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EmployeePersonalDetails from "../components/home/EmployeePersonalDetails";
import "../styles/HomeStyles.css"
import { ChevronLeft, ChevronRight, Check, X, Users, HomeIcon, Calendar, UserCog, MonitorIcon } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
    const [employee, setEmployee] = useState(null);
    const [hasAdminPermission, setHasAdminPermission] = useState(false);
    const [activeTab, setActiveTab] = useState("Home");
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRolesForMenu = async () => {
            try {
                const response = await api.get("/api/employee/");
                setEmployee(response.data);

                if(response.data.roles.includes("Owner") || response.data.roles.includes("HR")) {
                    setHasAdminPermission(true);
                }
            } catch (error) {
                console.error("Error fetching user roles:", error);
            }
        };

        fetchRolesForMenu();
    }, []);

    const renderActiveView = () => {
        switch (activeTab) {
            case "Contacts and Organization":
                return <ContactsAndOrg />;
            case "Time Off Requests":
                return <HolidayRequests employee={employee} />;
            case "Remote Work":
                return <RemoteWorkRequests employee={employee} />;
            case "Admin":
                navigate("/admin_panel")
            case "Home":
            default:
                return (
                    <>
                        <CalendarView />
                        <PendingApprovals />
                    </>
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

            <div className="main-content">{renderActiveView()}</div>
        </div>
    );
}

export default Home