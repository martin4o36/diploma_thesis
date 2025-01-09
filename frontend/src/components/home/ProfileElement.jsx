import { useEffect, useState } from "react";
import "../../styles/ProfileElement.css";
import api from "../../api";
import EmployeePersonalDetails from "./EmployeePersonalDetails";

function ProfileElement() {
    const [employee, setEmployee] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const response = await api.get("/api/employee/");
                setEmployee(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }

        fetchProfileInfo();
    }, []);

    const handleClick = () => {
        setShowProfile(true);
    };

    return (
        <div className="profile" onClick={handleClick}>
            {employee ? (
                <>
                    <span className="profile-name">
                        {employee.first_name} {employee.last_name}
                    </span>
                    <img 
                        src={`${import.meta.env.VITE_API_URL}${employee.profile_picture}`} 
                        alt="Picture" 
                        className="profile-image"
                    />

                    {showProfile && (
                        <EmployeePersonalDetails 
                            employee={employee} 
                            onClose={() => { setShowProfile(false) }}    
                        />
                    )}
                </>
            ) : (
                <span>Loading profile...</span>
            )}
        </div>
    );
}

export default ProfileElement;