import React from "react";

const Input = ({
  type,
  onChange,
  value,
  name,
  id,
  important,
  onBlur,
  error,
  icon,
  disabled,
}) => {
  return (
    <React.Fragment>
      <i className="material-icons prefix">{icon}</i>
      <label htmlFor={name}>
        {id}
        {important ? " *" : ""}
      </label>

      <input
        type={type}
        name={name}
        id={id}
        onChange={onChange}
        value={value}
        className={` ${error ? (error.length ? "invalid" : "valid") : ""} `}
        required={important}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error ? <p className="red-text center error">{error}</p> : null}
    </React.Fragment>
  );
};

export default Input;
