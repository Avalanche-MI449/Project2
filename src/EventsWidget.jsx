import React from 'react';

function EventsWidget({ events, onPrev, onNext, page, totalPages, loading, error }) {
  return (
    <div className="panel-body">
      <div className="panel-heading">
        <h3 className="panel-title">Events</h3>
      </div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div id="events" className="button-grid">
          {events.map((event, index) => (
            <button
              key={index}
              className="event-btn"
              onClick={() => {
                if (!event.url) {
                  return;
                }
                window.open(event.url, '_blank', 'noopener,noreferrer');
              }}
              disabled={!event.url}
              title={event.url ? 'Open on Ticketmaster' : 'Ticketmaster link unavailable'}
            >
              <div><strong>{event.name}</strong></div>
              <div>{event.dates?.start?.localDate || 'Date not available'}</div>
              <div style={{fontSize: '0.9em', color: '#9aa7ff'}}>
                {event._embedded?.venues?.[0] ? `${event._embedded.venues[0].name} in ${event._embedded.venues[0].city?.name || ''}` : 'Venue not available'}
              </div>
            </button>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pager-controls">
            <button onClick={onPrev} disabled={page === 0}>Prev</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button onClick={onNext} disabled={page >= totalPages - 1}>Next</button>
          </div>
        )}
    </div>
  );
}

export default EventsWidget;

