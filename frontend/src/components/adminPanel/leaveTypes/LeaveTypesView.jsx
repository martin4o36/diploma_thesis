import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/leaveStyles/LeaveTypesStyles.css"
import AddLeaveTypeForm from "./AddLeaveTypeForm";
import EditLeaveTypeForm from "./EditLeaveType";
import { Trash2, Edit2, Plus } from "lucide-react";


function LeaveTypesView() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);

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

    const handleEditLeaveType = async (leaveType) => {
        setSelectedLeaveType(leaveType);
        setShowEditForm(true);
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
                    <Plus size={20} />
                    <span>Add Leave Type</span>
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

            {showEditForm && selectedLeaveType && (
                <EditLeaveTypeForm
                    leaveType={selectedLeaveType}
                    onSuccess={() => {
                        fetchLeaveTypes();
                        setShowEditForm(false);
                    }}
                    onCancel={() => setShowEditForm(false)}
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
                                    onClick={() => handleEditLeaveType(leaveType)}
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