import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import "../../styles/CalendarView.css"
import api from "../../api";

function CalendarView({ employee }) {
    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [employeesEvents, setEmployeesEvents] = useState({});
    const [employeeNames, setEmployeeNames] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const nonWorkingDaysResponse = await api.get(`/api/non-working-days/${employee.country}/`);
            setNonWorkingDays(nonWorkingDaysResponse.data);

            const employeeEventsResponse = await api.get(`/api/request/${employee.department_id}/events/`);
            console.log(employeeEventsResponse.data.employees);
            setEmployeesEvents(employeeEventsResponse.data || {});
            setEmployeeNames(employeeEventsResponse.data.employees.reduce((acc, emp) => {
                acc[emp.employee_id] = `${emp.first_name} ${emp.middle_name} ${emp.last_name}`;
                return acc;
            }, {}));
        }

        fetchEvents();
    }, [employee.country, employee.department_id]);

    useEffect(() => {
        if (employeesEvents.approved_holidays || employeesEvents.approved_remote_requests) {
            const expandedEvents = [];

            const addEventForPeriod = (event, type) => {
                const startDate = new Date(event.start_date);
                const endDate = new Date(event.end_date);
                const employeeName = employeeNames[event.employee_id] || "Unknown Employee";

                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    expandedEvents.push({
                        type: type,
                        date: new Date(d),
                        description: type === "Time Off" ? "Time Off" : "Remote Work",
                        employeeName: employeeName,
                        isStart: d.getTime() === startDate.getTime(),
                        isEnd: d.getTime() === endDate.getTime()
                    });
                }
            };

            (employeesEvents.approved_holidays || []).forEach(holiday => {
                addEventForPeriod(holiday, "Time Off");
            });

            (employeesEvents.approved_remote_requests || []).forEach(remote => {
                addEventForPeriod(remote, "Remote");
            });

            nonWorkingDays.forEach(nwd => {
                expandedEvents.push({
                    type: "Holiday",
                    date: new Date(nwd.date),
                    description: nwd.description,
                    isStart: true,
                    isEnd: true
                });
            });

            setEvents(expandedEvents);
        }
    }, [nonWorkingDays, employeesEvents, employeeNames]);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getMonthName = (date) => {
        return date.toLocaleString("default", {
            month: "long",
        });
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };
    
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
                    <button onClick={previousMonth} className="home-nav-button">
                        <ChevronLeft />
                    </button>
                    <span className="home-current-month">
                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                    </span>
                    <button onClick={nextMonth} className="home-nav-button">
                        <ChevronRight />
                    </button>
                </div>
            </div>

            <div className="home-calendar-grid">
                {weekDays.map((day) => (
                    <div key={day} className="home-weekday">{day}</div>
                ))}
                {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = events.filter(
                        (event) =>
                            event.date.getDate() === day && event.date.getMonth() === currentDate.getMonth()
                    );

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
                                            <span className="calendar-employee-name">
                                                {event.employeeName}
                                            </span>
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