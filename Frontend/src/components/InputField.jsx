import React from 'react';
import '../styles/InputField.css'; // Import from styles folder

const InputField = ({ label, name, type = 'text', placeholder, value, onChange, ...props }) => {
  return (
    <div className="input-field-group">
      <label className="input-field-label">{label}</label>
      <input
        type={type}
        name={name}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default InputField;