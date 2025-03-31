import LeaveBalanceOverview from "./components/LeaveBalanceOverview";
import RequestsHistory from "./components/RequestsHistory";
import UpcomingRequests from "./components/UpcomingRequests";
import "./styles/SelfServicePortal.css";

function SelfServicePortal({ employee }) {
    return(
        <div className="self-service-container">
            <LeaveBalanceOverview employee_id={employee.employee_id} />
            
            <div className="requests-container">
                <div className="upcoming-requests">
                    <UpcomingRequests employee_id={employee.employee_id} />
                </div>
                <div className="requests-history">
                    <RequestsHistory employee_id={employee.employee_id} />
                </div>
            </div>
        </div>
    );
};

export default SelfServicePortal;