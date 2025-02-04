import { useState } from "react";
import MyHolidayRequests from "../components/home/requests/holiday/MyHolidayRequests";
import PendingHolidayRequests from "../components/home/requests/holiday/PendingHolidayRequests";
import AddHolidayRequest from "../components/home/requests/holiday/AddHolidayRequest";
import "../styles/requests/RequestStyles.css"

function HolidayRequests({ employee }) {
    const canApproveRequests = employee.roles.includes("Manager") || employee.roles.includes("Owner");
    const [selectedTab, setSelectedTab] = useState("myRequests");

    return (
        <div className="holiday-container">
            <div className="holiday-header">
                <h1 className="holiday-title">Time Off Requests</h1>
                <p className="holiday-description">
                    View and manage your requests for time off.
                </p>
            </div>
            <div className="holiday-card">
                <nav className="holiday-tabs">
                    <button
                        onClick={() => setSelectedTab("myRequests")}
                        className={`holiday-tab ${
                            selectedTab === "myRequests" ? "active" : ""
                        }`}
                    >
                        My Requests
                    </button>
                    <button
                        onClick={() => setSelectedTab("addRequest")}
                        className={`holiday-tab ${
                            selectedTab === "addRequest" ? "active" : ""
                        }`}
                    >
                        Add Request
                    </button>
                    {canApproveRequests && (
                        <button
                            onClick={() => setSelectedTab("pendingRequests")}
                            className={`holiday-tab ${
                                selectedTab === "pendingRequests" ? "active" : ""
                            }`}
                        >
                            Pending Requests
                        </button>
                    )}
                </nav>
                <div className="holiday-content">
                    {selectedTab === "myRequests" && (
                        <MyHolidayRequests employee={employee} />
                    )}
                    {selectedTab === "addRequest" && (
                        <AddHolidayRequest employee={employee} />
                    )}
                    {selectedTab === "pendingRequests" && canApproveRequests && (
                        <PendingHolidayRequests employee={employee} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default HolidayRequests;