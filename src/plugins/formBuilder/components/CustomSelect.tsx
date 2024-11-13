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
    addAttributes?: Record<string, any>; // Add additional attributes
  };
  value: any; // value can be any type, but should be an array when multiple is used
  onChange: (value: any[]) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ field, value, onChange, onBlur, onFocus }) => {
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
    let selectedValue = event.target.value;

    // Ensure the value is an array for multiple selections
    if (!Array.isArray(selectedValue)) {
      selectedValue = [selectedValue];
    }

    onChange(selectedValue);

    // Validate the selected value if a pattern is provided
    if (validation?.pattern && !validation.pattern.test(String(selectedValue))) {
      setError(validation.errorMessage || 'Invalid selection');
    } else {
      setError(null);
    }
  };

  return (
    <FormControl fullWidth={fullWidth} sx={style} size={size} required={required} error={!!error}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '1px', fontSize: '12px' }}>
        {label}
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <Select
        id={name}
        value={Array.isArray(value) && value.length > 0 ? value : ''} // Set default empty value
        onChange={handleChange}
        name={name}
        onBlur={onBlur}
        onFocus={onFocus}
        sx={{
          '& .MuiSelect-select': {
            fontSize: '12px', // Smaller font size for selected value
            padding: '2px 8px', // Smaller padding for the select input
          },
          '& .MuiInputBase-root': {
            fontSize: '12px', // Ensuring smaller font size for the select field
            padding: '2px 8px', // Smaller padding for the select field
          },
        }}
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
      {error && <FormHelperText sx={{ margin: '0px', fontSize: '10px' }}>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
