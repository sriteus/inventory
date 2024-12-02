import React, { useState } from 'react';

import { Select, MenuItem, FormControl, FormHelperText } from '@mui/material';

import HelperTooltip from './HelperToolTip'; // Assuming this is in the same directory

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  field: {
    label: string;
    name: string;
    options?: any; // Define options here as part of the field
    required?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    style?: React.CSSProperties;
    helperText?: string; // Added helperText for tooltip
    validation?: {
      pattern?: RegExp;
      errorMessage?: string;
    };
    addAttributes?: Record<string, any>; // Add additional attributes
  };
  value: any; // value can be any type, but should be an array when multiple is used
  onChange: (value: any) => void;
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
    helperText,
    validation,
    size,
    addAttributes,
  } = field;
  let slectOptions = [];
  if (options.length !== 0) {
    slectOptions = options.data;
  }
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: any) => {
    let selectedValue = event.target.value;

    // If it's a single select, we don't need to wrap it in an array
    if (Array.isArray(selectedValue)) {
      selectedValue = selectedValue.length === 1 ? selectedValue[0] : selectedValue;
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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <label htmlFor={name} style={{ fontSize: '12px' }}>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </label>
        {helperText && <HelperTooltip helperText={helperText} />}
      </div>
      <Select
        id={name}
        value={value || ''} // Default to empty string if value is undefined or null
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
        {slectOptions.length > 0 ? (
          slectOptions.map((option: any, index: any) => (
            <MenuItem key={index} value={option.value}>
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
