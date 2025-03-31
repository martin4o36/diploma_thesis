import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import "../../styles/CalendarView.css";
import api from "../../api";

function CalendarView({ employee }) {
    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [employeesEvents, setEmployeesEvents] = useState({});
    const [employeeNames, setEmployeeNames] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [nonWorkingDaysResponse, employeeEventsResponse] = await Promise.all([
                    api.get(`/api/non-working-days/${employee.country}/`),
                    api.get(`/api/request/${employee.department_id}/events/`)
                ]);

                setNonWorkingDays(nonWorkingDaysResponse.data);
                setEmployeesEvents(employeeEventsResponse.data || {});

                if (employeeEventsResponse.data?.employees?.length) {
                    setEmployeeNames((prevNames) => {
                        const newNames = employeeEventsResponse.data.employees.reduce((acc, emp) => {
                            acc[emp.employee_id] = `${emp.first_name} ${emp.middle_name} ${emp.last_name}`;
                            return acc;
                        }, {});
                        return JSON.stringify(prevNames) !== JSON.stringify(newNames) ? newNames : prevNames;
                    });
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [employee.country, employee.department_id]);

    useEffect(() => {
        if (!employeesEvents?.approved_holidays && !employeesEvents?.approved_remote_requests) return;

        setEvents(() => {
            const expandedEvents = [];

            const addEventForPeriod = (event, type) => {
                const startDate = new Date(event.start_date);
                const endDate = new Date(event.end_date);
                const employeeName = employeeNames[event.employee_id] || "Unknown Employee";

                for (let d = startDate.getTime(); d <= endDate.getTime(); d += 86400000) {
                    expandedEvents.push({
                        type,
                        date: new Date(d),
                        description: type === "Time Off" ? "Time Off" : "Remote Work",
                        employeeName,
                        isStart: d === startDate.getTime(),
                        isEnd: d === endDate.getTime(),
                    });
                }
            };

            employeesEvents.approved_holidays?.forEach(holiday => addEventForPeriod(holiday, "Time Off"));
            employeesEvents.approved_remote_requests?.forEach(remote => addEventForPeriod(remote, "Remote"));

            nonWorkingDays.forEach(nwd => {
                expandedEvents.push({
                    type: "Holiday",
                    date: new Date(nwd.date),
                    description: nwd.description,
                    isStart: true,
                    isEnd: true,
                });
            });

            return expandedEvents;
        });
    }, [nonWorkingDays, employeesEvents, employeeNames]);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    
    const getMonthName = (date) => date.toLocaleString("default", { month: "long" });

    const changeMonth = (offset) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset));
    };

    const filteredEvents = useMemo(() => {
        return events.filter(event =>
            event.date.getFullYear() === currentDate.getFullYear() &&
            event.date.getMonth() === currentDate.getMonth()
        );
    }, [events, currentDate]);

    return (
        <div className="home-calendar-container">
            <div className="home-calendar-header">
                <div className="home-event-labels">
                    {[
                        { label: "Holiday", color: "orange" },
                        { label: "Remote", color: "skyblue" },
                        { label: "Time Off", color: "green" },
                    ].map((item) => (
                        <span key={item.label} className={`home-event-label home-event-label-${item.color}`}>
                            {item.label}
                        </span>
                    ))}
                </div>

                <div className="home-month-navigation">
                    <button onClick={() => changeMonth(-1)} className="home-nav-button">
                        <ChevronLeft />
                    </button>
                    <span className="home-current-month">
                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => changeMonth(1)} className="home-nav-button">
                        <ChevronRight />
                    </button>
                </div>
            </div>

            <div className="home-calendar-grid">
                {weekDays.map((day) => (
                    <div key={day} className="home-weekday">{day}</div>
                ))}
                {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = filteredEvents.filter(event => event.date.getDate() === day);

                    return (
                        <div key={i} className="home-calendar-day">
                            <span className="home-day-number">{day}</span>
                            {dayEvents.length > 0 && (
                                <div className="home-event-tooltip">
                                    {dayEvents.map((event, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                color:
                                                    event.type === "Holiday"
                                                        ? "orange"
                                                        : event.type === "Remote"
                                                        ? "skyblue"
                                                        : "green",
                                            }}
                                        >
                                            <span className="generic-description">
                                                {event.description}
                                            </span>
                                            {event.employeeName && (
                                                <span className="calendar-employee-name">
                                                    {event.employeeName}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CalendarView;
