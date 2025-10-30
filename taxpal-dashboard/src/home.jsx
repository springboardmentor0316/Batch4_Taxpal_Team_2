import React from "react";
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

export default function Home() {
  const barData = [
    { name: "Jan", uv: 4000, pv: 2400 },
    { name: "Feb", uv: 3000, pv: 1398 },
    { name: "Mar", uv: 6000, pv: 6000 },
    { name: "Apr", uv: 3080, pv: 3000 },
    { name: "May", uv: 4890, pv: 8000 },
    { name: "Jun", uv: 5090, pv: 800 },
    { name: "Jul", uv: 3490, pv: 4300 },
  ];

  const pieData = [
    { name: "Food", value: 21 },
    { name: "Rent/Mortgage", value: 68 },
    { name: "Utilities", value: 10 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

  return (
    <div>
      <header className="dashboard-header">
        <div>
          <h2>Financial Dashboard</h2>
          <p className="subtitle">Welcome to TaxPal app</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-green">+ Record Income</button>
          <button className="btn btn-red">+ Record Expense</button>
        </div>
      </header>

      <section className="cards-row">
        <div className="card small">
          <div className="card-title">Monthly Income</div>
          <h3 className="card-value">$0.00</h3>
          <div className="card-meta">↑ 10% from last month</div>
        </div>

        <div className="card small">
          <div className="card-title">Monthly Expenses</div>
          <h3 className="card-value">$0.00</h3>
          <div className="card-meta">↑ 8% from last month</div>
        </div>

        <div className="card small">
          <div className="card-title">Bills Due</div>
          <h3 className="card-value">$0.00</h3>
          <div className="card-meta">No upcoming bills</div>
        </div>

        <div className="card small">
          <div className="card-title">Savings Rate</div>
          <h3 className="card-value">0.0%</h3>
          <div className="card-meta">↑ 3.2% from your goal</div>
        </div>
      </section>

      <section className="charts-row">
        <div className="chart-panel">
          <div className="panel-header">
            <h4>Income vs Expenses</h4>
            <div className="period-buttons">
              <button className="period">Year</button>
              <button className="period">Quarter</button>
              <button className="period active">Month</button>
            </div>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" fill="#10B981" name="Income" />
                <Bar dataKey="pv" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart panel */}
<div className="chart-panel pie-panel">
  <div className="panel-header">
    <h4>Expense Breakdown</h4>
  </div>

  <div className="panel-body">
    {/* Recharts PieChart as before (ResponsiveContainer/PieChart) */}
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={pieData}
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
          labelLine={false}
          label={({  percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>

    {/* Legend / text below */}
    <div className="pie-legend">
      <strong>Breakdown</strong>
      <ul>
        {pieData.map((d, i) => (
          <li key={d.name}>
            <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span>{d.name} — {d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

      </section>
      </div>
  );
}
