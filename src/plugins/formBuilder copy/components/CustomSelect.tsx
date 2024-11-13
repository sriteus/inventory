import React, { useState } from 'react';

import { Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  field: {
    label: string;
    name: string;
    options?: Option[];
    required?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    style?: React.CSSProperties;
    validation?: {
      pattern?: RegExp;
      errorMessage?: string;
    };
    addAttributes?: Record<string, any>; // Add the addAttributes field
  };
  value: string | number;
  onChange: (value: string | number) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ field, value, onChange }) => {
  const {
    label,
    name,
    options = [],
    required,
    fullWidth,
    style,
    validation,
    size,
    addAttributes,
  } = field;
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    onChange(selectedValue);

    if (validation?.pattern && !validation.pattern.test(String(selectedValue))) {
      setError(validation.errorMessage || 'Invalid selection');
    } else {
      setError(null);
    }
  };

  return (
    <FormControl fullWidth={fullWidth} sx={style} size={size} required={required} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        name={name}
        {...addAttributes} // Spread the addAttributes into the Select component
      >
        {options.length > 0 ? (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options available</MenuItem>
        )}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
