import { REQUEST_STATUS_OPTIONS } from '@/constants/adminNavigation';
import { selectClassName } from '@/constants/forms';

export default function RequestStatusSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={selectClassName}
    >
      {REQUEST_STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
