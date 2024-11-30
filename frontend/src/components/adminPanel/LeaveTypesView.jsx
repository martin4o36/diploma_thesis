import { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/adminPanelStyles/LeaveTypesStyles.css"


function LeaveTypesView() {
    const [leaveTypes, setleaveTypes] = useState([]);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await api.get("/api/leave_types/");
                setleaveTypes(response.data);
            } catch (error) {
                console.log("Error fetching leave types:", error);
            }
        };

        fetchLeaveTypes();
    }, []);

    const handleAddLeaveType = () => {
        console.log("Add Leave Type button clicked!");
    };

    const handleLeaveTypeAction = async (action) => {
        switch (action) {
            case "edit":
                console.log("Edit leave type:");
                break;
            case "delete":
                console.log("Delete leave type:");
                break;
        }
    };

    return (
        <div className="leave-types-container">
            <div className="leave-types-header">
                <h2>Leave Types</h2>
                <button className="add-leave-button" onClick={handleAddLeaveType}>
                    <i className="fa fa-plus"></i> Add Leave Type
                </button>
            </div>
            <ul className="leave-types-list">
                {leaveTypes.map((leaveType) => (
                    <li key={leaveType.leave_id} className="leave-type-item">
                        <strong>{leaveType.leave_name}</strong>
                        <span>{leaveType.days} days</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveTypeAction("edit");
                            }}
                        >
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveTypeAction("delete");
                            }}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LeaveTypesView;