'use client';

import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  className?: string;
  extendedProps?: {
    count?: number;
  };
}

export default function Calendar() {
  const calendarRef = useRef<any>(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [currentDate, setCurrentDate] = useState('2025-05-01');
  const [dateRange, setDateRange] = useState('Showing 01 May - 7 May 2025');

  const events: Event[] = [
    // Sunday (May 1, 2025)
    { 
      id: '1', 
      title: 'Wheel Fixing', 
      start: '2025-05-01T09:00:00', 
      end: '2025-05-01T10:00:00',
      className: 'blue-event'
    },
    { 
      id: '2', 
      title: 'Wheel Fixing', 
      start: '2025-05-01T16:00:00', 
      end: '2025-05-01T18:00:00',
      className: 'blue-event'
    },
    
    // Monday (May 2, 2025)
    { 
      id: '3', 
      title: 'Car Wash', 
      start: '2025-05-02T09:00:00', 
      end: '2025-05-02T10:00:00',
      className: 'orange-event'
    },
    { 
      id: '4', 
      title: 'Wheel Fixing', 
      start: '2025-05-02T11:00:00', 
      end: '2025-05-02T13:00:00',
      className: 'blue-event',
      extendedProps: { count: 2 }
    },
    { 
      id: '5', 
      title: 'Car Wash', 
      start: '2025-05-02T13:00:00', 
      end: '2025-05-02T14:00:00',
      className: 'orange-event'
    },
    { 
      id: '6', 
      title: 'Car Wash', 
      start: '2025-05-02T15:00:00', 
      end: '2025-05-02T16:00:00',
      className: 'orange-event'
    },
    
    // Tuesday (May 3, 2025)
    { 
      id: '7', 
      title: 'Wheel Fixing', 
      start: '2025-05-03T13:00:00', 
      end: '2025-05-03T15:00:00',
      className: 'blue-event'
    },
    
    // Wednesday (May 4, 2025)
    { 
      id: '8', 
      title: 'Car Wash', 
      start: '2025-05-04T09:00:00', 
      end: '2025-05-04T11:00:00',
      className: 'orange-event',
      extendedProps: { count: 3 }
    },
    { 
      id: '9', 
      title: 'Car Wash', 
      start: '2025-05-04T13:00:00', 
      end: '2025-05-04T14:00:00',
      className: 'orange-event'
    },
    { 
      id: '10', 
      title: 'Wheel Fixing', 
      start: '2025-05-04T16:00:00', 
      end: '2025-05-04T18:00:00',
      className: 'blue-event'
    },
    
    // Thursday (May 5, 2025)
    { 
      id: '11', 
      title: 'Car Wash', 
      start: '2025-05-05T10:00:00', 
      end: '2025-05-05T11:00:00',
      className: 'orange-event'
    },
    { 
      id: '12', 
      title: 'Wheel Fixing', 
      start: '2025-05-05T12:00:00', 
      end: '2025-05-05T13:00:00',
      className: 'blue-event'
    },
    { 
      id: '13', 
      title: 'Car Wash', 
      start: '2025-05-05T15:00:00', 
      end: '2025-05-05T16:00:00',
      className: 'orange-event'
    },
    
    // Friday (May 6, 2025)
    { 
      id: '14', 
      title: 'Wheel Fixing', 
      start: '2025-05-06T09:00:00', 
      end: '2025-05-06T10:00:00',
      className: 'blue-event'
    },
    { 
      id: '15', 
      title: 'Car Wash', 
      start: '2025-05-06T13:00:00', 
      end: '2025-05-06T15:00:00',
      className: 'orange-event'
    },
    { 
      id: '16', 
      title: 'Exterior Wash', 
      start: '2025-05-06T17:00:00', 
      end: '2025-05-06T18:00:00',
      className: 'blue-event'
    },
    
    // Saturday (May 7, 2025)
    { 
      id: '17', 
      title: 'Wheel Fixing', 
      start: '2025-05-07T10:00:00', 
      end: '2025-05-07T11:00:00',
      className: 'blue-event'
    },
    { 
      id: '18', 
      title: 'Car Wash', 
      start: '2025-05-07T12:00:00', 
      end: '2025-05-07T14:00:00',
      className: 'orange-event'
    },
    { 
      id: '19', 
      title: 'Engine wash', 
      start: '2025-05-07T15:00:00', 
      end: '2025-05-07T17:00:00',
      className: 'orange-event'
    },
  ];

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Please enter a title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        className: 'blue-event'
      });
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  };

  const createEventId = () => {
    return String(Math.random()).replace(/\D/g, '');
  };

  const handleViewChange = (event: any) => {
    const newView = event.target.value;
    let calendarView = 'timeGridWeek';
    
    switch (newView) {
      case 'Weekly':
        calendarView = 'timeGridWeek';
        break;
      case 'Daily':
        calendarView = 'timeGridDay';
        break;
      case 'Monthly':
        calendarView = 'dayGridMonth';
        break;
      default:
        calendarView = 'timeGridWeek';
    }
    
    setCurrentView(calendarView);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(calendarView);
    }
  };

  const updateDateRange = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const start = api.view.currentStart;
      const end = api.view.currentEnd;
      
      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      };
      
      setDateRange(`Showing ${formatDate(start)} - ${formatDate(end)}`);
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateDateRange();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateDateRange();
    }
  };

  const getCurrentMonthYear = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const currentDate = api.getDate();
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'May 2025';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="calendar-wrapper">
        {/* Custom Header to match the image */}
        <div className="custom-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="header-title">All Schedule</h1>
              <div className="nav-controls">
                <button 
                  className="nav-arrow" 
                  onClick={handlePrev}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="current-month">{getCurrentMonthYear()}</span>
                <button 
                  className="nav-arrow" 
                  onClick={handleNext}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="header-right">
              <div className="view-dropdown">
                <select 
                  className="view-select" 
                  value={currentView === 'timeGridWeek' ? 'Weekly' : currentView === 'timeGridDay' ? 'Daily' : 'Monthly'} 
                  onChange={handleViewChange}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div className="date-range">{dateRange}</div>
            </div>
          </div>
        </div>
        
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={false} // Hide default toolbar
          initialView="timeGridWeek"
          initialDate="2025-05-01"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
        //   rowheight
          eventClick={handleEventClick} 
          height={600}
          contentHeight={300}
          aspectRatio={1}
          expandRows={true}
          slotMinTime="09:00:00"
          slotMaxTime="18:00:00"
          allDaySlot={false}
          nowIndicator={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: '09:00',
            endTime: '17:00',
          }}
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }}
          dayHeaderFormat={{
            weekday: 'short',
            day: 'numeric'
          }}
          titleFormat={{
            month: 'long',
            year: 'numeric'
          }}
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }}
          eventClassNames={(arg) => {
            const classes = [arg.event.className || ''];
            if (arg.event.extendedProps?.count) {
              classes.push('has-count');
            }
            return classes;
          }}
          eventContent={(arg) => {
            // Format the time range for display
            const startTime = arg.event.start;
            const endTime = arg.event.end;
            
            const formatTime = (date: Date | null) => {
              if (!date) return '';
              const hour = date.getHours();
              const ampm = hour >= 12 ? 'pm' : 'am';
              const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              return `${displayHour.toString().padStart(2, '0')} ${ampm}`;
            };
            
            const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            
            return (
              <div className="event-content">
                <div className="event-text">
                  <div className="event-title">{arg.event.title}</div>
                  <div className="event-time">{timeRange}</div>
                </div>
                {arg.event.extendedProps?.count && (
                  <div className="event-count">{arg.event.extendedProps.count}+</div>
                )}
              </div>
            );
          }}
          viewDidMount={(arg) => {
            setCurrentView(arg.view.type);
            updateDateRange();
          }}
          datesSet={(arg) => {
            updateDateRange();
          }}
          slotLabelContent={(arg) => {
            // Custom time format to match the image (09 am, 10 am, etc.)
            const hour = arg.date.getHours();
            const ampm = hour >= 12 ? 'pm' : 'am';
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            return `${displayHour.toString().padStart(2, '0')} ${ampm}`;
          }}
          dayHeaderContent={(arg) => {
            // Custom day header format to match the image (1 Sun, 2 Mon, etc.)
            const day = arg.date.getDate();
            const weekday = arg.date.toLocaleDateString('en-US', { weekday: 'short' });
            return `${day} ${weekday}`;
          }}
        />
      </div>
    </div>
  );
} 