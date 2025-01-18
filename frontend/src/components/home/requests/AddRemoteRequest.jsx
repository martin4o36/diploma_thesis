import { useState } from "react";
import api from "../../../api";

function AddRemoteRequest({employee, onSave, onCancel}) {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [requestData, setRequestData] = useState({
        employee_id: employee.employee_id,
        start_date: "",
        end_date: "",
        approver_id: "",
        comment: "",
    });

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            const response = await api.get("/api/leave-types/");
            setLeaveTypes(response.data);
        };

        fetchLeaveTypes();
    }, []);


    const handleSaveRequest = async () => {

    }

    return(
        <div>
            Add Remote Request
        </div>
    );
}

export default AddRemoteRequest;