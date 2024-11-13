import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface CustomTextFieldProps {
  field: {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    fullWidth?: boolean;
    style?: React.CSSProperties;
    validation?: {
      pattern?: RegExp;
      errorMessage?: string;
    };
    size?: 'small' | 'medium';
    addAttributes?: Record<string, any>;
  };
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  field,
  value,
  onChange,
  onKeyDown,
  onKeyUp,
  onBlur,
  onFocus,
}) => {
  const { label, name, placeholder, required, fullWidth, style, validation, size, addAttributes } =
    field;
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    onChange(inputValue);

    if (validation?.pattern && !validation.pattern.test(inputValue)) {
      setError(validation.errorMessage || 'Invalid input');
    } else {
      setError(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyUp) {
      onKeyUp(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(event);
    }
  };

  return (
    <TextField
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      fullWidth={fullWidth}
      sx={style}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      onFocus={handleFocus}
      error={!!error}
      helperText={error}
      size={size}
      {...addAttributes}
    />
  );
};

export default CustomTextField;
