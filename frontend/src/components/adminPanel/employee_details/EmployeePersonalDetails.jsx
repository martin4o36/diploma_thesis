import { X } from "lucide-react";
import "../../../styles/adminPanelStyles/balances/PersonalDetailsStyles.css"

function EmployeePersonalDetails({ employee }) {
    return (
        <div className="add-employee-modal">
            <div className="add-employee-form-scrollable">
                <div className="add-employee-form-header">
                    <h2 className="add-employee-form-title">Employee Personal Details</h2>
                </div>

                <div className="add-employee-form-section">
                    <h3 className="add-employee-form-section-title">Profile Information</h3>
                    <div className="add-employee-form-group">
                        <div className="profile-picture-and-names">
                            <div className="add-employee-form-profile-picture">
                                <div className="profile-picture-preview">
                                    {employee.profile_picture ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${employee.profile_picture}`}
                                            alt={`${employee.first_name} ${employee.last_name}`}
                                            className="profile-picture"
                                        />
                                    ) : (
                                        <span className="profile-picture-placeholder">No Photo</span>
                                    )}
                                </div>
                            </div>
                            <div className="add-employee-form-names">
                                <p><strong>First Name:</strong> {employee.first_name}</p>
                                <p><strong>Middle Name:</strong> {employee.middle_name || 'N/A'}</p>
                                <p><strong>Last Name:</strong> {employee.last_name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="add-employee-form-section">
                    <h3 className="add-employee-form-section-title">Contact Details</h3>
                    <div className="add-employee-form-inline-group">
                        <div>
                            <p><strong>Email:</strong> {employee.email}</p>
                        </div>
                        <div>
                            <p><strong>Phone Number:</strong> {employee.phone_number}</p>
                        </div>
                    </div>
                </div>

                <div className="add-employee-form-section">
                    <h3 className="add-employee-form-section-title">Work Information</h3>
                    <div className="add-employee-form-inline-group">
                        <div>
                            <p><strong>Position:</strong> {employee.position}</p>
                        </div>
                        <div>
                            <p><strong>Department ID:</strong> {employee.department_id}</p>
                        </div>
                        <div>
                            <p><strong>Status:</strong> {employee.status}</p>
                        </div>
                    </div>
                    <div className="add-employee-form-inline-group">
                        <div>
                            <p><strong>Hired Date:</strong> {employee.hired_date}</p>
                        </div>
                        <div>
                            <p><strong>Left Date:</strong> {employee.left_date ? employee.left_date : "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="add-employee-form-section">
                    <h3 className="add-employee-form-section-title">Location Details</h3>
                    <div className="add-employee-form-inline-group">
                        <div>
                            <p><strong>City:</strong> {employee.city}</p>
                        </div>
                        <div>
                            <p><strong>Country:</strong> {employee.country || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="add-employee-form-actions">
                    <button
                        type="button"
                        className="add-employee-form-button cancel"
                        onClick={() => console.log('Close')}
                    >
                        <X />
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmployeePersonalDetails;