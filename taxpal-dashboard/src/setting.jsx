import React, { useState } from "react";

function Setting() {
const [categories, setCategories] = useState([
"Business Expenses",
"Office Rent",
"Software Subscriptions",
"Professional Development",
"Marketing",
"Travel",
]);

const handleEdit = (index) => {
const newName = prompt("Enter new category name:", categories[index]);
if (newName) {
const updated = [...categories];
updated[index] = newName;
setCategories(updated);
}
};

const handleDelete = (index) => {
if (window.confirm("Delete this category?")) {
setCategories(categories.filter((_, i) => i !== index));
}
};

return (
<div className="settig">
    {/* Main Content */}
  <div className="setting-main">
    <h2>Category Management</h2>

    <div className="tabs">
      <button className="active">Expense Categories</button>
      <button>Income Categories</button>
    </div>

    <ul className="category-list">
      {categories.map((cat, index) => (
        <li key={index} className="category-item">
          <span>{cat}</span>
          <div className="actions">
            <button onClick={() => handleEdit(index)}>✏️</button>
            <button onClick={() => handleDelete(index)}>❌</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>
    );
}

export default Setting;