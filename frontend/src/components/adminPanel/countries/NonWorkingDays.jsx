import { useState, useEffect } from "react";
import api from "../../../api";

function NonWorkingDays({ country }) {
    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [newDay, setNewDay] = useState({ date: "", description: "" });

    const fetchNonWorkingDays = async () => {
        try {
            const response = await api.get(`/api/non-working-days/${country.country_id}/`);
            setNonWorkingDays(response.data);
        } catch (error) {
            console.error("Error fetching non-working days:", error);
        }
    };

    useEffect(() => {
        fetchNonWorkingDays();
    }, [country]);

    const handleAddDay = async () => {
        try {
            await api.post("/api/non-working-days/add/", {
                country_id: country.country_id,
                date: newDay.date,
                description: newDay.description
            });
            setNewDay({ date: "", description: "" });
            fetchNonWorkingDays();
        } catch (error) {
            console.error("Error adding non-working day:", error);
        }
    };

    const handleDeleteDay = async (dayId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this non-working day?");
        if (confirmDelete) {
            try {
                await api.delete(`/api/non-working-days/${country.country_id}/${dayId}/delete/`);
                fetchNonWorkingDays();
            } catch (error) {
                console.error("Error deleting non-working day:", error);
            }
        }
    };

    return (
        <div className="non-working-days-container">
            <h3>Non-Working Days for {country.country_name}</h3>
            <ul className="non-working-days-list">
                {nonWorkingDays.map((day) => (
                    <li key={day.nwd_id} className="non-working-day-item">
                        {day.date} - {day.description}
                        <button
                            onClick={() => handleDeleteDay(day.nwd_id)}
                            className="delete-nwd-btn"
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="add-nwd-form">
                <input
                    type="date"
                    value={newDay.date}
                    onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newDay.description}
                    onChange={(e) => setNewDay({ ...newDay, description: e.target.value })}
                />
                <button onClick={handleAddDay} className="add-nwd-btn">Add</button>
            </div>
        </div>
    );
}

export default NonWorkingDays;