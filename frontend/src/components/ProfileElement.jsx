import { useEffect, useState } from "react";
import "../styles/ProfileElement.css";
import api from "../api";

function ProfileElement({ onClick }) {
    const [employee, setEmployee] = useState(null);

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

    return (
        <div className="profile" onClick={onClick}>
            {employee ? (
                <>
                    <img 
                        src={`${import.meta.env.VITE_API_URL}${employee.profile_picture}`} 
                        alt="Picture" 
                        className="profile-image"
                    />
                    <span className="profile-name">
                        {employee.first_name} {employee.last_name}
                    </span>
                </>
            ) : (
                <span>Loading profile...</span>
            )}
        </div>
    );
}

export default ProfileElement;