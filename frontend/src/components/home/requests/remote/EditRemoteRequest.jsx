import { useState, useEffect } from "react";
import api from "../../../../api";
import { Calendar, Trash2, Edit2, Plus, Clock, User, MessageSquare, Info, Check, Save, X, } from "lucide-react";
import "../../../../styles/requests/EditRequest.css"

function EditRemoteRequest({ request, onSave, onCancel }) {
    const [requestData, setRequestData] = useState({
        ...request
    });

    useEffect(() => {
        console.log(request);
    }, [request]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveRequest = async () => {
        try {
            await api.put(`/api/request/${request.remote_id}/edit-remote/`, requestData);
            onSave();
        } catch (error) {
            console.error("Error updating holiday request:", error);
        }
    };

    return (
        <div>
            <div className="edit-holiday-modal-overlay" onClick={onCancel}></div>
            <div className="edit-holiday-modal">
                <div className="edit-holiday-header">
                    <h2 className="edit-holiday-title">Edit Remote Request</h2>
                </div>
                <form
                    className="edit-holiday-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="form-row inline">
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={requestData.start_date}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={requestData.end_date}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row inline">
                        <div className="form-group">
                            <label className="form-label">Approver</label>
                            <select
                                name="approver_id"
                                value={requestData.approver}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="">Select approver</option>
                                <option value={requestData.approver}>
                                    {requestData.approver_name}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Comment</label>
                        <textarea
                            name="comment"
                            value={requestData.comment || ""}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Add any additional information about your request..."
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" onClick={handleSaveRequest}>
                            <Save /> Save Changes
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            <X /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditRemoteRequest;