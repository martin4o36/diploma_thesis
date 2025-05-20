import LeaveBalanceOverview from "./components/LeaveBalanceOverview";
import UpcomingRequests from "./components/UpcomingRequests";
import "./styles/SelfServicePortal.css";

function SelfServicePortal({ employee }) {
    return(
        <div className="self-service-container">
            <LeaveBalanceOverview employee_id={employee.employee_id} />
            
            <UpcomingRequests employee_id={employee.employee_id} />
        </div>
    );
};

export default SelfServicePortal;