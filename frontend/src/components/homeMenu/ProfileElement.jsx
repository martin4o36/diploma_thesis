import { useEffect, useState } from "react";
import "../../styles/ProfileElement.css";
import api from "../../api";

function ProfileElement() {
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const response = await api.get("/api/home_menu/employee");
                console.log(response.data);
                setEmployee(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }

        fetchProfileInfo();
    }, []);

    return (
        <div className="profile">
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
                </>
            ) : (
                <span>Loading profile...</span>
            )}
        </div>
    );
}

export default ProfileElement;