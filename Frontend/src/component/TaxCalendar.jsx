import React, { useState } from 'react';
import { FaBell, FaCalendarCheck, FaCalendarAlt } from 'react-icons/fa';

const TaxCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('October 2025');

  const months = [
    { name: 'January 2025', count: 2 },
    { name: 'February 2025', count: 2 },
    { name: 'March 2025', count: 2 },
    { name: 'April 2025', count: 3 },
    { name: 'May 2025', count: 2 },
    { name: 'June 2025', count: 2 },
    { name: 'July 2025', count: 2 },
    { name: 'August 2025', count: 2 },
    { name: 'September 2025', count: 2 },
    { name: 'October 2025', count: 2 },
    { name: 'November 2025', count: 2 },
    { name: 'December 2025', count: 2 },
  ];

  const events = {
    'October 2025': [
      {
        id: 1,
        title: 'Year-End Tax Planning',
        date: 'Oct 15, 2025',
        description: 'Begin year-end tax planning and estimate final quarter obligations.',
        type: 'reminder',
        icon: <FaBell />,
      },
      {
        id: 2,
        title: 'Extended Return Filing Deadline',
        date: 'Oct 15, 2025',
        description: 'Deadline for filing extended tax returns from April.',
        type: 'filing',
        icon: <FaCalendarCheck />,
      },
    ],
  };

  const quarterlyPayments = [
    {
      id: 1,
      title: 'Q4 - Estimated Tax Payment',
      date: 'Jan 15, 2025',
      quarter: 'Q4',
    },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '32px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
          Tax Calendar
        </h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Track important tax deadlines and reminders
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
        {/* Left Sidebar - Month Selector */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
            Select Month
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {months.map((month) => (
              <button
                key={month.name}
                onClick={() => setSelectedMonth(month.name)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: selectedMonth === month.name ? '#1a1a1a' : 'transparent',
                  color: selectedMonth === month.name ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: selectedMonth === month.name ? '600' : '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedMonth !== month.name) {
                    e.currentTarget.style.background = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMonth !== month.name) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{month.name}</span>
                <span
                  style={{
                    background: selectedMonth === month.name ? 'white' : '#e0e0e0',
                    color: selectedMonth === month.name ? '#1a1a1a' : '#666',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  {month.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div>
          {/* Month Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a1a' }}>
              {selectedMonth}
            </h2>
            <FaCalendarAlt style={{ fontSize: '24px', color: '#ccc' }} />
          </div>

          {/* Events List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {(events[selectedMonth] || []).map((event) => (
              <div
                key={event.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    color: event.type === 'reminder' ? '#3DBAEB' : '#10B981',
                    marginTop: '4px',
                  }}
                >
                  {event.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                      {event.title}
                    </h3>
                    <span
                      style={{
                        background: event.type === 'reminder' ? '#E0F2FE' : '#D1FAE5',
                        color: event.type === 'reminder' ? '#0369A1' : '#065F46',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      {event.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                    {event.date}
                  </p>
                  <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quarterly Payment Schedule */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a1a', marginBottom: '20px' }}>
              Quarterly Payment Schedule
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quarterlyPayments.map((payment) => (
                <div
                  key={payment.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px', color: '#F59E0B' }}>
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                        {payment.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>
                        {payment.date}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      background: '#FEF3C7',
                      color: '#92400E',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {payment.quarter}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalendar;