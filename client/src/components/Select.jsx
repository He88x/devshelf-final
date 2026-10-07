function Select({
  label,
  id,
  value,
  onChange,
  options,
  disabled = false,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;