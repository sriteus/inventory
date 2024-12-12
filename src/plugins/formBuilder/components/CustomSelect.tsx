import React, { useState } from 'react';
import { Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import HelperTooltip from './HelperToolTip';
import ErrorTooltip from './ErrorTooltip';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  field: {
    label: string;
    name: string;
    options?: any;
    required?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    style?: React.CSSProperties;
    helperText?: string;
    validation?: {
      pattern?: RegExp;
      errorMessage?: string;
    };
    addAttributes?: Record<string, any>;
    type?: string;
    disabled?: any;
  };
  value: any;
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
    type,
    disabled,
  } = field;

  const selectOptions = options?.data || [];
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: any) => {
    const selectedValue = event.target.value;

    onChange(selectedValue);

    if (validation?.pattern) {
      const isValid = Array.isArray(selectedValue)
        ? selectedValue.every((val) => validation.pattern?.test(String(val)))
        : validation.pattern.test(String(selectedValue));

      if (!isValid) {
        setError(validation.errorMessage || 'Invalid selection');
      } else {
        setError(null);
      }
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
        value={value || (type === 'multiple' ? [] : '')} // Default to an empty array for multiple select
        onChange={handleChange}
        name={name}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        multiple={type === 'multiple'}
        sx={{
          '& .MuiSelect-select': {
            fontSize: '12px',
            padding: '2px 8px',
          },
          '& .MuiInputBase-root': {
            fontSize: '12px',
            padding: '2px 8px',
          },
        }}
        {...addAttributes}
      >
        {selectOptions.length > 0 ? (
          selectOptions.map((option: any, index: any) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options available</MenuItem>
        )}
      </Select>
      <ErrorTooltip error={error} />
    </FormControl>
  );
};

export default CustomSelect;
