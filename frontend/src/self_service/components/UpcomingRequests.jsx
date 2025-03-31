import { useState, useEffect } from "react";
import api from "../../api";
import dayjs from "dayjs";
import "../styles/UpcomingRequestsStyles.css";

function UpcomingRequests({ employee_id }) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
		const fetchUpcomingRequests = async () => {
			try {
				const response = await api.get(`/api/request/${employee_id}/upcoming/`);
                const { upcoming_holidays, upcoming_remote_requests } = response.data;
                
                const holidayRequests = upcoming_holidays.map(req => ({
                    type: req.leave_type__leave_name,
                    id: req.request_id,
                    start_date: req.start_date,
                    end_date: req.end_date,
                    comment: req.comment,
                }));

                const remoteRequests = upcoming_remote_requests.map(req => ({
                    type: "Remote Work",
                    id: req.remote_id,
                    start_date: req.start_date,
                    end_date: req.end_date,
                    comment: req.comment,
                }));

                const allRequests = [...holidayRequests, ...remoteRequests].sort(
                    (a, b) => new Date(a.start_date) - new Date(b.start_date)
                );

                setRequests(allRequests);
			} catch (error) {
				console.error("Error fetching upcoming requests:", error);
			}
		};

		fetchUpcomingRequests();
	}, [employee_id]);

    return (
        <div className="upcoming-requests">
            <h2>Upcoming Requests</h2>
            <ul>
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <li key={req.id} className={`request-item ${req.type.toLowerCase().replace(" ", "-")}`}>
                            <strong>{req.type}</strong>: {dayjs(req.start_date).format('MMM D, YYYY')} → {dayjs(req.end_date).format('MMM D, YYYY')}
                            {req.comment && <p className="comment">"{req.comment}"</p>}
                        </li>
                    ))
                ) : (
                    <p>No upcoming requests.</p>
                )}
            </ul>
        </div>
    );
};

export default UpcomingRequests;