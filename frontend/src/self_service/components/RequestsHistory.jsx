import { useEffect, useState } from "react";
import api from "../../api";

function RequestsHistory({ employee_id }) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
		const fetchRequestsHistory = async () => {
			try {
				const response = await api.get(`/api/request/${employee_id}/history/`);
                console.log(response.data);
                // const { upcoming_holidays, upcoming_remote_requests } = response.data;
                
                // const holidayRequests = upcoming_holidays.map(req => ({
                //     type: req.leave_type__leave_name,
                //     id: req.request_id,
                //     start_date: req.start_date,
                //     end_date: req.end_date,
                //     comment: req.comment,
                // }));

                // const remoteRequests = upcoming_remote_requests.map(req => ({
                //     type: "Remote Work",
                //     id: req.remote_id,
                //     start_date: req.start_date,
                //     end_date: req.end_date,
                //     comment: req.comment,
                // }));

                // const allRequests = [...holidayRequests, ...remoteRequests].sort(
                //     (a, b) => new Date(a.start_date) - new Date(b.start_date)
                // );

                // setRequests(allRequests);
			} catch (error) {
				console.error("Error fetching upcoming requests:", error);
			}
		};

		fetchRequestsHistory();
	}, [employee_id]);


    return(
        <div>
            Requests History
        </div>
    );
};

export default RequestsHistory;