import React, { useState } from 'react';
import { TextField } from '@mui/material';

interface CustomDatePickerProps {
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
  value: string | null;
  onChange: (value: string | null) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
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
      required={required}
      placeholder={placeholder}
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
      InputLabelProps={{ shrink: true }}
      size={size}
      {...addAttributes}
      InputProps={{
        ...addAttributes?.InputProps,
        inputComponent: 'input',
        inputProps: {
          type: 'date',
          value: value || '',
        },
      }}
    />
  );
};

export default CustomDatePicker;
