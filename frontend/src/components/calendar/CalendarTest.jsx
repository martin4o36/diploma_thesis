import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const WorkCalendar = () => {
  const [events, setEvents] = useState([
    { title: 'Vacation', start: new Date(2024, 11, 20), end: new Date(2024, 11, 25), type: 'vacation' },
    { title: 'Home Office', start: new Date(2024, 11, 28), end: new Date(2024, 11, 28), type: 'home-office' }
  ]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.type === 'vacation' ? '#FFA500' : '#87CEFA';
    return { style: { backgroundColor } };
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default WorkCalendar;