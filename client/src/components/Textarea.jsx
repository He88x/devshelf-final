function Textarea({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  required = false,
  disabled = false,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

export default Textarea;