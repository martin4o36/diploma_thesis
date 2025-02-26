import { useEffect, useState } from "react";
import api from "../api";
import LeaveBalanceOverview from "./components/LeaveBalanceOverview";
import RequestsHistory from "./components/RequestsHistory";
import UpcomingRequests from "./components/UpcomingRequests";

function SelfServicePortal({ employee }) {
    const [requests, setRequests] = useState([]);
    const [remoteRequests, setRemoteRequests] = useState([]);
    const [upcomingRequests, setUpcomingRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const requestsResponse = await api.get(`/api/request/${employee.employee_id}/holiday/`);
            setRequests(requestsResponse.data);
    
            const remoteResponse = await api.get(`/api/request/${employee.employee_id}/remote/`);
            setRemoteRequests(remoteResponse.data);
        };

        fetchRequests();
    }, []);

    return(
        <div>
            <LeaveBalanceOverview employee_id={employee.employee_id} />
            <UpcomingRequests upcoming_requests={upcomingRequests} />
            <RequestsHistory holiday_requests={requests} remote_requests={remoteRequests} />
        </div>
    );
};

export default SelfServicePortal;