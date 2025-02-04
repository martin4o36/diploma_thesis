import { useState } from "react";
import MyRemoteRequests from "../components/home/requests/remote/MyRemoteRequests";
import PendingRemoteRequests from "../components/home/requests/remote/PendingRemoteRequests";
import AddRemoteRequest from "../components/home/requests/remote/AddRemoteRequest";
import api from "../api";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";

function RemoteWorkRequests({ employee }) {
    const canApproveRequests = employee.roles.includes("Manager") || employee.roles.includes("Owner");
    const [selectedTab, setSelectedTab] = useState("myRequests");

    return (
        <div className="holiday-container">
            <div className="holiday-header">
                <h1 className="holiday-title">Remote Work Requests</h1>
                <p className="holiday-description">
                    View and manage your requests for remote work.
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
                        <MyRemoteRequests employee={employee} />
                    )}
                    {selectedTab === "addRequest" && (
                        <AddRemoteRequest employee={employee} />
                    )}
                    {selectedTab === "pendingRequests" && canApproveRequests && (
                        <PendingRemoteRequests employee={employee} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default RemoteWorkRequests;