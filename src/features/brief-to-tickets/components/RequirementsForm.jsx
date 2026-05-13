import { MAX_REQUIREMENTS_LENGTH } from "../constants.js";

/**
 * @param {{
 *   value: string,
 *   onChange: (v: string) => void,
 *   onSubmit: () => void,
 *   disabled?: boolean,
 *   error?: string | null,
 * }} props
 */
export function RequirementsForm({
  value,
  onChange,
  onSubmit,
  disabled = false,
  error = null,
}) {
  const len = value.length;
  const over = len > MAX_REQUIREMENTS_LENGTH;

  function handleSubmit(e) {
    e.preventDefault();
    if (!disabled && !over && value.trim()) onSubmit();
  }

  return (
    <form className="bt-form" onSubmit={handleSubmit}>
      <label className="bt-label" htmlFor="requirements">
        Project requirements
      </label>
      <textarea
        id="requirements"
        className="bt-textarea"
        rows={12}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste the client brief or project requirements here…"
        maxLength={MAX_REQUIREMENTS_LENGTH}
        aria-invalid={Boolean(error) || over}
        aria-describedby="requirements-hint"
      />
      <p id="requirements-hint" className="bt-hint">
        {len.toLocaleString()} / {MAX_REQUIREMENTS_LENGTH.toLocaleString()}{" "}
        characters
        {over && (
          <span className="bt-hint-warn"> — shorten the text to continue.</span>
        )}
      </p>
      {error && (
        <p className="bt-field-error" role="alert">
          {error}
        </p>
      )}
      <div className="bt-actions">
        <button
          type="submit"
          className="bt-btn bt-btn--primary"
          disabled={disabled || over || !value.trim()}
        >
          Generate breakdown
        </button>
      </div>
    </form>
  );
}
