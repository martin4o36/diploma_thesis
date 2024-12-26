import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/leaveStyles/LeaveTypesStyles.css"
import AddLeaveTypeForm from "./AddLeaveTypeForm";
import { Trash2, Edit2 } from "lucide-react";


function LeaveTypesView() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get("/api/leave-types/");
            setLeaveTypes(response.data);
        } catch (error) {
            console.error("Error fetching leave types:", error);
        }
    };

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const handleEditLeaveType = async (leaveId) => {
        
    }

    const handleDeleteLeaveType = async (leaveId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this leave type?");

        if(confirmDelete) {
            try {
                await api.delete(`/api/leave-types/${leaveId}/delete/`);
                fetchLeaveTypes();
            } catch (error) {
                console.error("Error deleting leave type:", error);
            }
        }
    }

    return (
        <div className="leave-types-container">
            <div className="leave-types-header">
                <h2>Leave Types</h2>
                <button className="add-leave-button" onClick={() => setShowAddForm(true)}>
                    <span>+</span> Add Leave Type
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

            <table className="leave-types-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Days</th>
                        <th>Default Days to Bring Forward</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveTypes.map((leaveType) => (
                        <tr key={leaveType.leave_id}>
                            <td>{leaveType.leave_name}</td>
                            <td>{leaveType.days} days</td>
                            <td>{leaveType.default_bring_forward_days} days</td>
                            <td className="actions">
                                <button
                                    onClick={() => handleEditLeaveType(leaveType.leave_id)}
                                    className="edit-btn"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteLeaveType(leaveType.leave_id)}
                                    className="delete-btn"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LeaveTypesView;