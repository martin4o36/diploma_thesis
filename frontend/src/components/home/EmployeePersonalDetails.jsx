import { X, Mail, Phone, MapPin, Clock, Building2, ChevronRight } from "lucide-react";
import "../../styles/PersonalDetailStyles.css"
import { useEffect, useState } from "react";
import api from "../../api";

function EmployeePersonalDetails({ employee, onClose }) {
    const [departments, setDepartments] = useState([]);
    const [managerInfo, setManagerInfo] = useState([]);
    const [countryName, setCountryName] = useState("");

    useEffect(() => {
        const fetchCountryAndDepartments = async () => {
            try {
                const countryResponse = await api.get(`/api/country/${employee.country}/by-country_id/`);
                setCountryName(countryResponse.data.country_name);

                const departmentsResponse = await api.get(`/api/departments/${employee.department_id}/profile/`);
                setDepartments(departmentsResponse.data.departments_chain);
                console.log(departmentsResponse.data);
                setManagerInfo(departmentsResponse.data.manager_info);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }

        if (employee) {
            fetchCountryAndDepartments();
        }
    }, [employee]);

    return (
        <div>
            <div className="employee-modal-overlay" onClick={(e) => { e.stopPropagation(); onClose(); }}> </div>
            <div className="employee-details-modal">
                <div className="employee-details-header">
                    <img className="details-profile-image" src={`${import.meta.env.VITE_API_URL}${employee.profile_picture}`} alt="Profile" />
                    <div className="personal-info">
                        <h2 className="employee-name">{`${employee.first_name} ${employee.last_name}`}</h2>
                        <p className="employee-position">{employee.position}</p>
                        <p className="employee-age">{`${employee.age} years old`}</p>
                    </div>
                    <div className="contact-info">
                        <p><Mail className="mail-icon" /> {employee.email}</p>
                        <p><Phone className="phone-icon" /> {employee.phone_number}</p>
                        <p><MapPin className="map-icon" /> {`${employee.city}, ${countryName}`}</p>
                    </div>
                </div>

                <button
                    className="employee-details-close-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <X className="close-icon"/>
                </button>

                <div className="work-info">
                    <h3>Work Information</h3>
                    <p><Clock className="clock-icon" /> {`${employee.work_start} - ${employee.work_end}`}</p>
                    <div className="department-chain">
                        <Building2 className="building-icon"/>
                        {departments.length > 0 && departments.map((dept, index) => (
                            <span key={dept.department_id}>
                                {dept.dep_name}
                                {index < departments.length - 1 && <ChevronRight />}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="manager-info">
                    <h3>Reports to</h3>
                    {managerInfo ? (
                        <div className="employee-details-header">
                            <img
                                className="manager-profile-image"
                                src={`${import.meta.env.VITE_API_URL}${managerInfo.profile_picture}`}
                                alt="Manager"
                            />
                            <div className="personal-info">
                                <h2 className="employee-name">{`${managerInfo.first_name} ${managerInfo.last_name}`}</h2>
                                <p className="employee-position">{managerInfo.position}</p>
                            </div>
                            <div className="contact-info">
                                <p>
                                    <Mail className="mail-icon" /> {managerInfo.email}
                                </p>
                                <p>
                                    <Phone className="phone-icon" /> {managerInfo.phone_number}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="no-manager-info">No manager information available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployeePersonalDetails;