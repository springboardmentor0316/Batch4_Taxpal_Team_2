import React, { useEffect, useState } from "react";
import { FaBell, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/TaxCalendar.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TaxCalendar() {
const navigate = useNavigate();

<button onClick={() => navigate('/dashboard')}>
  Go to Dashboard
</button>

  const token = localStorage.getItem("token");

  const [taxPayment, setTaxPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  // Fetch user tax payment record from backend
  const fetchPayment = async () => {
    try {
      const res = await fetch(`${API}/api/taxPayment`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        // if not ok, clear payment and return (avoid throwing)
        setTaxPayment(null);
        return;
      }
      const data = await res.json();
      setTaxPayment(data);
    } catch (err) {
      console.error("fetchPayment error:", err);
      setTaxPayment(null);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, );

  
  // --- Calendar events (kept from code 1) ---
  const events = [
    {
      id: 1,
      title: "Reminder : Q1 Estimated Tax Payment",
      date: "June 1, 2025",
      description:
        "Reminder for updating Q1 estimated tax payment due on June 15, 2025",
      type: "reminder",
      month: "June, 2025",
    },
    {
      id: 2,
      title: "Q1 Estimated Tax Payment",
      date: "June 15, 2025",
      description: "Q1 estimated tax payment due (25% of total tax)",
      type: "payment",
      quarter: "Q1",
      dueDate: new Date("2025-06-15"),
      month: "June, 2025",
    },

    {
      id: 3,
      title: "Reminder : Q2 Estimated Tax Payment",
      date: "September 1, 2025",
      description:
        "Reminder for updating Q2 estimated tax payment due on September 15, 2025",
      type: "reminder",
      month: "September, 2025",
    },
    {
      id: 4,
      title: "Q2 Estimated Tax Payment",
      date: "September 15, 2025",
      description: "Q2 estimated tax payment due (50% of total tax, cumulative)",
      type: "payment",
      quarter: "Q2",
      dueDate: new Date("2025-09-15"),
      month: "September, 2025",
    },

    {
      id: 5,
      title: "Reminder : Q3 Estimated Tax Payment",
      date: "December 1, 2025",
      description:
        "Reminder for updating Q3 estimated tax payment due on December 15, 2025",
      type: "reminder",
      month: "December, 2025",
    },
    {
      id: 6,
      title: "Q3 Estimated Tax Payment",
      date: "December 15, 2025",
      description: "Q3 estimated tax payment due (75% of total tax, cumulative)",
      type: "payment",
      quarter: "Q3",
      dueDate: new Date("2025-12-15"),
      month: "December, 2025",
    },

    {
      id: 7,
      title: "Reminder : Q4 Estimated Tax Payment",
      date: "March 1, 2026",
      description:
        "Reminder for updating Q4 estimated tax payment due on March 15, 2026",
      type: "reminder",
      month: "March, 2026",
    },
    {
      id: 8,
      title: "Q4 Estimated Tax Payment",
      date: "March 15, 2026",
      description: "Q4 estimated tax payment due (100% of total tax)",
      type: "payment",
      quarter: "Q4",
      dueDate: new Date("2026-03-15"),
      month: "March, 2026",
    },
  ];

  // Group events by month
  const grouped = events.reduce((acc, ev) => {
    if (!acc[ev.month]) acc[ev.month] = [];
    acc[ev.month].push(ev);
    return acc;
  }, {});

  // --- Badge style for PAYMENT only (returns CSS utility class) ---
  const badgeClass = (ev) => {
    if (!taxPayment) return "badge-yellow";

    const isPaid = Boolean(taxPayment[ev.quarter]);
    const isLate = ev.dueDate && new Date() > ev.dueDate && !isPaid;

    if (isPaid) return "badge-green";
    if (isLate) return "badge-red";
    return "badge-orange";
  };

  // --- Handle payment confirmation
  const confirmPayment = async () => {
    if (!selectedQuarter) return;
    try {
      const res = await fetch(`${API}/api/taxPayment/${selectedQuarter}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ paid: true }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error((j && (j.error || j.message)) || res.statusText || "Failed to mark paid");
      }
      setShowModal(false);
      setSelectedQuarter(null);
      await fetchPayment(); // refresh data
      toast.success("Quarterly Tax Paid Successfully!!");
    } catch (err) {
      console.error("confirmPayment error:", err);
      toast.error("Failed to record payment. Try again.");
    }
  };

  return (
    <div className="tax-calendar-container">
      <div className="tax-calendar-header">
        <h1>Tax Calendar</h1>
        <p>Track important tax deadlines and reminders</p>
      </div>

      <div className="tax-calendar-layout">
        {/* Left: month selector (simple static list) */}
        <div className="month-panel">
          <h2 className="month-panel-title">Select Month</h2>

          <div className="month-list">
            {Object.keys(grouped).map((month) => (
              <button
                key={month}
                onClick={() => {
                  // set selected month by scrolling to that section — simple UX improvement
                  const el = document.getElementById(month);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="month-button"
              >
                <span>{month}</span>
                <span className="month-count">{grouped[month].length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: events */}
        <div>
          <div className="events-header">
            <h2>{/* dynamic heading not needed here */}Upcoming Events</h2>
            <FaCalendarAlt style={{ fontSize: 24, color: "#ccc" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
            {Object.keys(grouped).map((month) => (
              <div key={month} id={month}>
                <h3 style={{ fontSize: 20, margin: "12px 0", color: "#4b5563" }}>{month}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {grouped[month].map((ev) => (
                    <div key={ev.id} className="event-card">
                      <div className="event-icon">
                        {ev.type === "reminder" ? <FaBell /> : <FaCalendarAlt />}
                      </div>

                      <div className="event-info">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <h3>{ev.title}</h3>
                          <span className={`event-tag ${ev.type === "reminder" ? "event-tag-reminder" : "event-tag-payment"}`}>
                            {ev.type}
                          </span>
                        </div>

                        <p className="event-date">{ev.date}</p>
                        <p className="event-desc">{ev.description}</p>

                        {ev.type === "payment" && taxPayment?.estimatedQuarterlyTaxes != null && (
                          <p style={{ marginTop: 8, fontWeight: 700 }}>
                            Amount: ₹{Number(taxPayment.estimatedQuarterlyTaxes).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>

                      {ev.type === "reminder" ? (
                        <span className="event-tag event-tag-reminder">Reminder</span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedQuarter(ev.quarter);
                            setShowModal(true);
                          }}
                          className={badgeClass(ev)}
                          style={{ border: "none", padding: "8px 12px", cursor: "pointer" }}
                        >
                          Payment
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quarterly payment schedule: listing payments */}
          {/* <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {events.filter((e) => e.type === "payment").map((payment) => (
              <div key={payment.id} className="schedule-card">
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ fontSize: 24, color: "#F59E0B" }}>
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{payment.title}</h4>
                    <p style={{ margin: 0, color: "#9CA3AF" }}>{payment.date}</p>
                  </div>
                </div>

                <span className="schedule-quarter-badge">{payment.quarter}</span>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Made the payment?</h3>

            <div className="modal-actions">
              <button className="modal-btn modal-btn-no" onClick={() => setShowModal(false)}>
                No
              </button>
              <button className="modal-btn modal-btn-yes" onClick={confirmPayment}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
