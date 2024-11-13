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
}

const CustomNumberField: React.FC<CustomNumberFieldProps> = ({ field, value, onChange }) => {
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

  return (
    <TextField
      label={label}
      name={name}
      placeholder={placeholder}
      required={required}
      fullWidth={fullWidth}
      sx={style}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error}
      type="number"
      size={size}
    />
  );
};

export default CustomNumberField;
