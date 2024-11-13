import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface CustomNumberFieldProps {
  field: {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    style?: React.CSSProperties;
    validation?: {
      pattern?: RegExp;
      errorMessage?: string;
    };
  };
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
}

const CustomNumberField: React.FC<CustomNumberFieldProps> = ({
  field,
  value,
  onChange,
  onKeyDown,
  onKeyUp,
  onBlur,
  onFocus,
}) => {
  const { label, name, placeholder, required, fullWidth, style, validation, size } = field;
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    onChange(inputValue);

    if (validation?.pattern && !validation.pattern.test(inputValue)) {
      setError(validation.errorMessage || 'Invalid number');
    } else {
      setError(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (onKeyUp) {
      onKeyUp(event);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleFocus = (event: React.FocusEvent) => {
    if (onFocus) {
      onFocus(event);
    }
  };

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      fullWidth={fullWidth}
      size={size}
      style={style}
      error={!!error}
      helperText={error}
      type="number"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
};

export default CustomNumberField;
