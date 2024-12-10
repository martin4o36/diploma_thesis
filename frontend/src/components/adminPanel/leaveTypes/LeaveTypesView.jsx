import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/LeaveTypesStyles.css"
import AddLeaveTypeForm from "./AddLeaveTypeForm";


function LeaveTypesView() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get("/api/leave_types/");
            setLeaveTypes(response.data);
        } catch (error) {
            console.error("Error fetching leave types:", error);
        }
    };

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const handleEditLeaveTypeName = async (leaveId) => {
        
    }

    const handleEditLeaveTypeDays = async (leaveId) => {
        
    }

    const handleDeleteLeaveType = async (leaveId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this leave type?");

        if(confirmDelete) {
            try {
                await api.delete(`/api/leave_types/${leaveId}/delete/`);
                fetchLeaveTypes();
            } catch (error) {
                console.error("Error deleting leave type:", error);
            }
        } else {
            console.log("Deletion cancelled");
        }
    }

    return (
        <div className="leave-types-container">
            <div className="leave-types-header">
                <h2>Leave Types</h2>
                <button className="add-leave-button" onClick={() => setShowAddForm(true)} >
                    <i className="fa fa-plus"></i> Add Leave Type
                </button>
            </div>

            {showAddForm && (
                <AddLeaveTypeForm
                    onSuccess={() => {
                        fetchLeaveTypes();
                        setShowAddForm(false);
                    }}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            <ul className="leave-types-list">
                {leaveTypes.map((leaveType) => (
                    <li key={leaveType.leave_id} className="leave-type-item">
                        <strong>{leaveType.leave_name}</strong>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditLeaveTypeName(leaveType.leave_id);
                            }}
                        >
                            <i className="fa fa-pencil"></i>
                        </button>
                        <span>{leaveType.days} days</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditLeaveTypeDays(leaveType.leave_id);
                            }}
                        >
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLeaveType(leaveType.leave_id);
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