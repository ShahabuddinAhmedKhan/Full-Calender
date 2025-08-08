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
    description?: string;
    reminder?: string;
  };
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  date: string;
  time: string;
  position: { x: number; y: number };
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (eventData: { title: string; description: string; reminder: string; className: string }) => void;
  position: { x: number; y: number };
  selectedDate: string;
  selectedTime: string;
}

const EventDetailsModal = ({ isOpen, onClose, events, date, time, position }: EventDetailsModalProps) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Calculate smart positioning to keep modal fully visible
  const calculatePosition = () => {
    const modalWidth = 500; // max-width of modal
    const modalHeight = 300; // estimated height
    const padding = 20; // padding from screen edges
    
    let left = position.x;
    let top = position.y; // Position is already set to below the event
    
    // Adjust horizontal position to keep modal in viewport
    if (left + modalWidth / 2 > window.innerWidth - padding) {
      left = window.innerWidth - modalWidth / 2 - padding;
    }
    if (left - modalWidth / 2 < padding) {
      left = modalWidth / 2 + padding;
    }
    
    // Check if modal would go off the bottom of the screen
    if (top + modalHeight > window.innerHeight - padding) {
      // If it would go off bottom, show above the event instead
      top = position.y - modalHeight - 20; // 20px above the event
    }
    
    return { left, top };
  };

  const { left, top } = calculatePosition();

  const modalStyle = {
    position: 'fixed' as const,
    left: `${left}px`,
    top: `${top}px`,
    transform: 'translateX(-50%)',
    zIndex: 1000
  };

  return (
    <>
      {/* Invisible overlay to handle clicks outside modal */}
      <div 
        className="modal-overlay" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'transparent'
        }}
      />
      
      {/* Modal content */}
      <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {events.length === 1 ? events[0].title : 'Order list'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          {events.map((event, index) => (
            <div key={event.id} className="event-detail-item">
              {events.length > 1 && (
                <h3 className="event-detail-title">{event.title}</h3>
              )}
              
              <div className="event-detail-info">
                <div className="detail-row">
                  <div className="detail-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <span className="detail-text">{formatDate(event.start)}</span>
                </div>
                
                <div className="detail-row">
                  <div className="detail-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                  </div>
                  <span className="detail-text">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </span>
                </div>
                
                <div className="detail-row">
                  <div className="detail-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                    </svg>
                  </div>
                  <span className="detail-text">
                    {event.extendedProps?.reminder || '1 hr Before'}
                  </span>
                </div>
                
                {event.extendedProps?.description && (
                  <div className="detail-row">
                    <div className="detail-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </div>
                    <span className="detail-text description">
                      {event.extendedProps.description}
                    </span>
                  </div>
                )}
              </div>
              
              {index < events.length - 1 && <div className="event-divider"></div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const AddEventModal = ({ isOpen, onClose, onAddEvent, position, selectedDate, selectedTime }: AddEventModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState('1 hr Before');
  const [className, setClassName] = useState('blue-event');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddEvent({ title: title.trim(), description, reminder, className });
      setTitle('');
      setDescription('');
      setReminder('1 hr Before');
      setClassName('blue-event');
    }
  };

  // Calculate smart positioning to keep modal fully visible
  const calculatePosition = () => {
    // Get actual modal dimensions from DOM or use estimates
    const modalWidth = Math.min(350, window.innerWidth - 40); // Responsive width
    const modalHeight = Math.min(320, window.innerHeight - 40); // Responsive height
    const padding = 20;
    
    let left = position.x;
    let top = position.y;
    
    // Ensure modal doesn't go off the right edge
    if (left + modalWidth / 2 > window.innerWidth - padding) {
      left = window.innerWidth - modalWidth / 2 - padding;
    }
    
    // Ensure modal doesn't go off the left edge
    if (left - modalWidth / 2 < padding) {
      left = modalWidth / 2 + padding;
    }
    
    // Check if modal would go off the bottom of the screen
    if (top + modalHeight > window.innerHeight - padding) {
      // Try to position above the click point
      const topPosition = position.y - modalHeight - 10;
      if (topPosition >= padding) {
        top = topPosition;
      } else {
        // If it would go off the top too, center it vertically
        top = (window.innerHeight - modalHeight) / 2;
      }
    }
    
    // Ensure modal doesn't go off the top
    if (top < padding) {
      top = padding;
    }
    
    // Final safety check - ensure modal is fully within viewport
    const maxTop = window.innerHeight - modalHeight - padding;
    if (top > maxTop) {
      top = maxTop;
    }
    
    return { left, top };
  };

  const { left, top } = calculatePosition();

  const modalStyle = {
    position: 'fixed' as const,
    left: `${left}px`,
    top: `${top}px`,
    transform: 'translateX(-50%)',
    zIndex: 1000
  };

  return (
    <>
      {/* Invisible overlay to handle clicks outside modal */}
      <div 
        className="modal-overlay" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'transparent'
        }}
      />
      
      {/* Modal content */}
      <div className="modal-content add-event-modal" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Event</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="add-event-form">
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="Enter event title"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reminder</label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="form-select"
              >
                <option value="15 min Before">15 min Before</option>
                <option value="30 min Before">30 min Before</option>
                <option value="1 hr Before">1 hr Before</option>
                <option value="2 hr Before">2 hr Before</option>
                <option value="1 day Before">1 day Before</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Event Type</label>
              <div className="event-type-options">
                <label className="event-type-option">
                  <input
                    type="radio"
                    value="blue-event"
                    checked={className === 'blue-event'}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                  <span className="event-type-color blue"></span>
                  <span>Blue Event</span>
                </label>
                <label className="event-type-option">
                  <input
                    type="radio"
                    value="orange-event"
                    checked={className === 'orange-event'}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                  <span className="event-type-color orange"></span>
                  <span>Orange Event</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default function Calendar() {
  const calendarRef = useRef<any>(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [currentDate, setCurrentDate] = useState('2025-05-01');
  const [dateRange, setDateRange] = useState('Showing 01 May - 7 May 2025');
  const processedEventsRef = useRef<Set<string>>(new Set());
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    events: Event[];
    date: string;
    time: string;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    events: [],
    date: '',
    time: '',
    position: { x: 0, y: 0 }
  });

  const [addEventModalState, setAddEventModalState] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    selectedDate: string;
    selectedTime: string;
    startStr: string;
    endStr: string;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    selectedDate: '',
    selectedTime: '',
    startStr: '',
    endStr: ''
  });

  const events: Event[] = [
    // Sunday (May 1, 2025)
    {
      id: '1',
      title: 'Wheel Fixing',
      start: '2025-05-01T09:00:00',
      end: '2025-05-01T10:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Premium mobile & in-garage detailing. We serve all vehicle types and offer expert wheel services',
        reminder: '1 hr Before'
      }
    },
    {
      id: '2',
      title: 'Wheel Fixing',
      start: '2025-05-01T16:00:00',
      end: '2025-05-01T18:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Professional wheel repair and maintenance services',
        reminder: '1 hr Before'
      }
    },

    // Monday (May 2, 2025)
    {
      id: '3',
      title: 'Car Wash',
      start: '2025-05-02T09:00:00',
      end: '2025-05-02T10:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Complete exterior and interior cleaning service',
        reminder: '1 hr Before'
      }
    },
    {
      id: '4',
      title: 'Wheel Fixing',
      start: '2025-05-02T11:00:00',
      end: '2025-05-02T13:00:00',
      className: 'blue-event',
      extendedProps: { 
        description: 'Multiple wheel repair appointments',
        reminder: '1 hr Before'
      }
    },
    {
      id: '4b',
      title: 'Car Wash',
      start: '2025-05-02T11:00:00',
      end: '2025-05-02T13:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Standard car wash service',
        reminder: '1 hr Before'
      }
    },
    {
      id: '5',
      title: 'Car Wash',
      start: '2025-05-02T13:00:00',
      end: '2025-05-02T14:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Standard car wash service',
        reminder: '1 hr Before'
      }
    },
    {
      id: '6',
      title: 'Car Wash',
      start: '2025-05-02T15:00:00',
      end: '2025-05-02T16:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Premium car wash with waxing',
        reminder: '1 hr Before'
      }
    },

    // Tuesday (May 3, 2025)
    {
      id: '7',
      title: 'Wheel Fixing',
      start: '2025-05-03T13:00:00',
      end: '2025-05-03T15:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Wheel alignment and balancing service',
        reminder: '1 hr Before'
      }
    },

    // Wednesday (May 4, 2025) - Multiple overlapping events
    {
      id: '8',
      title: 'Car Wash',
      start: '2025-05-04T12:00:00',
      end: '2025-05-04T13:00:00',
      className: 'orange-event',
      extendedProps: { 
        description: 'Multiple car wash appointments scheduled',
        reminder: '1 hr Before'
      }
    },
    {
      id: '8b',
      title: 'Wheel Fixing',
      start: '2025-05-04T12:00:00',
      end: '2025-05-04T13:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Wheel repair and maintenance',
        reminder: '1 hr Before'
      }
    },
    {
      id: '8c',
      title: 'Exterior Wash',
      start: '2025-05-04T12:00:00',
      end: '2025-05-04T13:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Exterior cleaning and waxing service',
        reminder: '1 hr Before'
      }
    },
    {
      id: '9',
      title: 'Car Wash',
      start: '2025-05-04T13:00:00',
      end: '2025-05-04T14:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Express car wash service',
        reminder: '1 hr Before'
      }
    },
    {
      id: '10',
      title: 'Wheel Fixing',
      start: '2025-05-04T16:00:00',
      end: '2025-05-04T18:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Wheel repair and tire replacement',
        reminder: '1 hr Before'
      }
    },

    // Thursday (May 5, 2025)
    {
      id: '11',
      title: 'Car Wash',
      start: '2025-05-05T10:00:00',
      end: '2025-05-05T11:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Full service car wash and detailing',
        reminder: '1 hr Before'
      }
    },
    {
      id: '12',
      title: 'Wheel Fixing',
      start: '2025-05-05T12:00:00',
      end: '2025-05-05T13:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Wheel refurbishment service',
        reminder: '1 hr Before'
      }
    },
    {
      id: '13',
      title: 'Car Wash',
      start: '2025-05-05T15:00:00',
      end: '2025-05-05T16:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Interior and exterior cleaning',
        reminder: '1 hr Before'
      }
    },

    // Friday (May 6, 2025)
    {
      id: '14',
      title: 'Wheel Fixing',
      start: '2025-05-06T09:00:00',
      end: '2025-05-06T10:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Wheel repair and maintenance',
        reminder: '1 hr Before'
      }
    },
    {
      id: '15',
      title: 'Car Wash',
      start: '2025-05-06T13:00:00',
      end: '2025-05-06T15:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Comprehensive car wash service',
        reminder: '1 hr Before'
      }
    },
    {
      id: '16',
      title: 'Exterior Wash',
      start: '2025-05-06T17:00:00',
      end: '2025-05-06T18:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Exterior cleaning and waxing service',
        reminder: '1 hr Before'
      }
    },

    // Saturday (May 7, 2025)
    {
      id: '17',
      title: 'Wheel Fixing',
      start: '2025-05-07T10:00:00',
      end: '2025-05-07T11:00:00',
      className: 'blue-event',
      extendedProps: {
        description: 'Wheel alignment and repair',
        reminder: '1 hr Before'
      }
    },
    {
      id: '18',
      title: 'Car Wash',
      start: '2025-05-07T12:00:00',
      end: '2025-05-07T14:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Full car wash and interior cleaning',
        reminder: '1 hr Before'
      }
    },
    {
      id: '19',
      title: 'Engine wash',
      start: '2025-05-07T15:00:00',
      end: '2025-05-07T17:00:00',
      className: 'orange-event',
      extendedProps: {
        description: 'Engine cleaning and degreasing service',
        reminder: '1 hr Before'
      }
    },
  ];

  const [currentEvents, setCurrentEvents] = useState<Event[]>(events);

  const handleEventChange = (changeInfo: any) => {
    // Update our events state when events are dragged or resized
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const updatedEvents = calendarApi.getEvents().map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        className: event.classNames?.includes('blue-event') ? 'blue-event' : 'orange-event',
        extendedProps: {
          count: event.extendedProps?.count,
          description: event.extendedProps?.description || 'Service appointment',
          reminder: event.extendedProps?.reminder || '1 hr Before'
        }
      }));
      setCurrentEvents(updatedEvents);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    // Format the selected date and time
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    };

    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);
    
    // Get click position and adjust for better positioning
    const clickX = selectInfo.jsEvent.clientX;
    const clickY = selectInfo.jsEvent.clientY;
    
    // Calculate optimal position based on screen size
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    // For mobile screens, center the modal
    if (screenWidth <= 480) {
      const position = {
        x: screenWidth / 2,
        y: screenHeight / 2
      };
      
      setAddEventModalState({
        isOpen: true,
        position,
        selectedDate: formatDate(startDate),
        selectedTime: `${formatTime(startDate)} - ${formatTime(endDate)}`,
        startStr: selectInfo.startStr,
        endStr: selectInfo.endStr
      });
    } else {
      // For desktop, position near click point
      const position = {
        x: clickX,
        y: clickY + 10 // Offset slightly below click point
      };

      setAddEventModalState({
        isOpen: true,
        position,
        selectedDate: formatDate(startDate),
        selectedTime: `${formatTime(startDate)} - ${formatTime(endDate)}`,
        startStr: selectInfo.startStr,
        endStr: selectInfo.endStr
      });
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const clickedEvent = clickInfo.event;
    const eventStart = clickedEvent.start;
    const eventEnd = clickedEvent.end;
    
    // Get all current events from FullCalendar API to include dragged events
    const calendarApi = calendarRef.current?.getApi();
    const currentEvents = calendarApi ? calendarApi.getEvents() : [];
    
    // Find all events that overlap with the clicked event's current time
    const overlappingEvents = currentEvents.filter((event: any) => {
      const eventStartTime = event.start;
      const eventEndTime = event.end;
      const clickedStartTime = new Date(eventStart);
      const clickedEndTime = new Date(eventEnd);
      
      return (
        (eventStartTime >= clickedStartTime && eventStartTime < clickedEndTime) ||
        (eventEndTime > clickedStartTime && eventEndTime <= clickedEndTime) ||
        (eventStartTime <= clickedStartTime && eventEndTime >= clickedEndTime)
      );
    }).map((event: any) => ({
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      className: event.classNames?.includes('blue-event') ? 'blue-event' : 'orange-event',
      extendedProps: {
        count: event.extendedProps?.count,
        description: event.extendedProps?.description || 'Service appointment',
        reminder: event.extendedProps?.reminder || '1 hr Before'
      }
    }));

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    };

    // Get the actual event element position for proper modal placement
    const eventElement = clickInfo.jsEvent.target.closest('.fc-event');
    const rect = eventElement ? eventElement.getBoundingClientRect() : clickInfo.jsEvent.target.getBoundingClientRect();
    
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10 // Position immediately below the event
    };

    setModalState({
      isOpen: true,
      events: overlappingEvents,
      date: formatDate(eventStart),
      time: `${formatTime(eventStart)} - ${formatTime(eventEnd)}`,
      position: position
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      events: [],
      date: '',
      time: '',
      position: { x: 0, y: 0 }
    });
  };

  const closeAddEventModal = () => {
    setAddEventModalState({
      isOpen: false,
      position: { x: 0, y: 0 },
      selectedDate: '',
      selectedTime: '',
      startStr: '',
      endStr: ''
    });
  };

  const handleAddEvent = (eventData: { title: string; description: string; reminder: string; className: string }) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      // Clear processed events to allow new overlap detection
      processedEventsRef.current.clear();
      
      calendarApi.addEvent({
        id: createEventId(),
        title: eventData.title,
        start: addEventModalState.startStr,
        end: addEventModalState.endStr,
        allDay: false,
        className: eventData.className,
        extendedProps: {
          description: eventData.description || 'New event created',
          reminder: eventData.reminder
        }
      });
    }
    closeAddEventModal();
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
    if (typeof window !== 'undefined' && calendarRef.current) {
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
          events={currentEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
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
          slotEventOverlap={true}
          eventOverlap={true}
          eventClassNames={(arg) => {
            const classes = [arg.event.className || ''];
            if (arg.event.extendedProps?.count) {
              classes.push('has-count');
            }
            return classes;
          }}
          eventDidMount={(arg) => {
            // Prevent infinite loop by checking if we've already processed this event
            const eventId = arg.event.id;
            if (processedEventsRef.current.has(eventId)) {
              return;
            }
            
            // Check for overlapping events and update the topmost event with count
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi) {
              const allEvents = calendarApi.getEvents();
              const overlappingEvents = allEvents.filter((event: any) => {
                if (event.id === arg.event.id) return false;
                
                const eventStart = event.start;
                const eventEnd = event.end;
                const currentStart = arg.event.start;
                const currentEnd = arg.event.end;
                
                // Check if events overlap with null checks
                if (!eventStart || !eventEnd || !currentStart || !currentEnd) return false;
                
                return (
                  (eventStart < currentEnd && eventEnd > currentStart) ||
                  (currentStart < eventEnd && currentEnd > eventStart)
                );
              });
              
              if (overlappingEvents.length > 0) {
                // Include current event in the overlap group
                const allOverlappingEvents = [arg.event, ...overlappingEvents];
                
                // Sort by start time to find the first event in the time slot
                const sortedEvents = allOverlappingEvents.sort((a: any, b: any) => {
                  const aStart = a.start.getTime();
                  const bStart = b.start.getTime();
                  if (aStart !== bStart) {
                    return aStart - bStart;
                  }
                  return a.id.localeCompare(b.id);
                });
                
                const visibleEvent = sortedEvents[0];
                const totalCount = allOverlappingEvents.length;
                
                // Mark all events as processed to prevent infinite loop
                allOverlappingEvents.forEach((event: any) => {
                  processedEventsRef.current.add(event.id);
                });
                
                // Update the visible event with count
                visibleEvent.setExtendedProp('count', totalCount);
                
                // Hide all other overlapping events
                allOverlappingEvents.forEach((event: any) => {
                  if (event.id !== visibleEvent.id) {
                    event.setProp('display', 'none');
                  }
                });
              } else {
                // Mark this event as processed even if no overlaps
                processedEventsRef.current.add(eventId);
              }
            }
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
                {arg.event.extendedProps?.count ? (
                  // Multiple events layout: count above, title in middle, time below
                  <div className="event-text multiple-events">
                    <div className="event-count-number">{arg.event.extendedProps.count}</div>
                    <div className="event-title">{arg.event.title}</div>
                    <div className="event-time">{timeRange}</div>
                  </div>
                ) : (
                  // Single event layout: title and time
                  <div className="event-text">
                    <div className="event-title">{arg.event.title}</div>
                    <div className="event-time">{timeRange}</div>
                  </div>
                )}
              </div>
            );
          }}
          viewDidMount={(arg) => {
            setCurrentView(arg.view.type);
            updateDateRange();
            // Clear processed events to force overlap detection on view change
            processedEventsRef.current.clear();
          }}
          datesSet={(arg) => {
            updateDateRange();
            // Clear processed events to force overlap detection when dates change
            processedEventsRef.current.clear();
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

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        events={modalState.events}
        date={modalState.date}
        time={modalState.time}
        position={modalState.position}
      />

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={addEventModalState.isOpen}
        onClose={closeAddEventModal}
        onAddEvent={handleAddEvent}
        position={addEventModalState.position}
        selectedDate={addEventModalState.selectedDate}
        selectedTime={addEventModalState.selectedTime}
      />
    </div>
  );
} 