import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../../styles/adminPanelStyles/countryStyles/CalendarStyles.css"

function CalendarView({ selectedCountry, nonWorkingDays }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h3 className="calendar-title">Calendar View</h3>
                <div className="calendar-navigation">
                    <button onClick={prevMonth} className="prev-month-button" aria-label="Previous month">
                        <ChevronLeft className="left-icon" />
                    </button>
                    <span className="current-month">
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <button onClick={nextMonth} className="next-month-button" aria-label="Next month">
                        <ChevronRight className="right-icon" />
                    </button>
                </div>
            </div>

            {selectedCountry ? (
                <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="calendar-day-header">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
                        <div key={`empty-${index}`} className="empty-cell" />
                    ))}
                    {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
                        const day = index + 1;
                        const currentMonthDate = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            day
                        );

                        const nonWorkingDay = nonWorkingDays.find(
                            (d) => new Date(d.date).toLocaleDateString() === currentMonthDate.toLocaleDateString()
                        );

                        return (
                            <div
                                key={day}
                                className={`calendar-day ${nonWorkingDay ? "non-working-day" : ""}`}
                                {...(nonWorkingDay && { "data-description": nonWorkingDay.description })}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>Select a country to display the calendar</p>
            )}
        </div>
    );
}

export default CalendarView;