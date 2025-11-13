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
  }, [refreshTrigger]); // refresh charts when transactions change

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactions = res.data.data;

      // ---- Bar Chart (Income vs Expenses per Month) ----
      const grouped = {};
      transactions.forEach((t) => {
        const month = new Date(t.date).toLocaleString("default", { month: "short" });
        if (!grouped[month]) grouped[month] = { name: month, income: 0, expense: 0 };

        if (t.type === "income") grouped[month].income += t.amount;
        else grouped[month].expense += t.amount;
      });

      setBarData(Object.values(grouped));

      // ---- Pie Chart (Expense Breakdown by Category) ----
      const expenseGroups = {};
      transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          if (!expenseGroups[t.category]) expenseGroups[t.category] = 0;
          expenseGroups[t.category] += t.amount;
        });

      const formattedPieData = Object.entries(expenseGroups).map(
        ([name, value]) => ({ name, value })
      );

      setPieData(formattedPieData);

    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <section className="charts-row" >

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
              <Tooltip />
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul style={{ listStyle: "none", paddingTop: "8px" }}>
            {pieData.map((d, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                {d.name} — ${d.value.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}
