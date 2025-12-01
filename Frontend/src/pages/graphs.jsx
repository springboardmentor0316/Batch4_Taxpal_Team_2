import React, { useState, useEffect } from "react";
import "../styles/Graphs.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Graphs({ refreshTrigger }) {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]); // refresh charts when transactions change

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setBarData([]);
        setPieData([]);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactions = Array.isArray(res?.data?.data) ? res.data.data : [];

      // ---- Bar Chart (Income vs Expenses per Month) ----
      // Group by year-month so different years don't collide and we can sort chronologically
      const grouped = {}; // key = "YYYY-MM"
      transactions.forEach((t) => {
        const dateVal = t.date || t.createdAt;
        if (!dateVal) return;
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return;

        const year = d.getFullYear();
        const monthIndex = d.getMonth(); // 0..11
        const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`; // e.g. "2025-09"
        const label = d.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. "Sep 2025"

        if (!grouped[key]) {
          grouped[key] = {
            key,
            monthIndex,
            year,
            name: label,
            income: 0,
            expense: 0,
          };
        }

        const amount = Number(t.amount || 0);
        if (t.type === "income") grouped[key].income += amount;
        else grouped[key].expense += amount;
      });

      // Convert to array and sort chronologically (oldest -> newest)
      const sortedMonths = Object.values(grouped).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthIndex - b.monthIndex;
      });

      setBarData(sortedMonths.map(({ name, income, expense }) => ({ name, income, expense })));

      // ---- Pie Chart (Expense Breakdown by Category) ----
      const expenseGroups = {};
      transactions.forEach((t) => {
        if (t.type !== "expense") return;
        const cat = t.category || "Other";
        expenseGroups[cat] = (expenseGroups[cat] || 0) + Number(t.amount || 0);
      });

      const formattedPieData = Object.entries(expenseGroups).map(([name, value]) => ({
        name,
        value,
      }));

      setPieData(formattedPieData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setBarData([]);
      setPieData([]);
    }
  };

  return (
    <section className="charts-row">
      {/* Bar Chart */}
      <div className="chart-panel" style={{ flex: 1, minWidth: "300px", marginLeft: "20px" }}>
        <div className="panel-header">
          <h4>Income vs Expenses (Monthly)</h4>
        </div>
        <div className="panel-body" style={{ height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value || 0).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expense" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="chart-panel" style={{ flex: 1, minWidth: "300px" }}>
        <div className="panel-header">
          <h4>Expense Breakdown</h4>
        </div>
        <div className="panel-body" style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value || 0).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
          <ul style={{ listStyle: "none", paddingTop: "8px" }}>
            {pieData.map((d, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: COLORS[i % COLORS.length],
                  }}
                />
                {d.name} — ${Number(d.value || 0).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
