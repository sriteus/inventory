import React, { useState } from 'react';

import { TextField, FormControl, FormHelperText } from '@mui/material';

import HelperTooltip from './HelperToolTip';
import ErrorTooltip from './ErrorTooltip';

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
    helperText?: string;
    disabled?: any;
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
  const {
    label,
    name,
    placeholder,
    required,
    fullWidth,
    style,
    validation,
    size,
    addAttributes,
    helperText,
    disabled,
  } = field;
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    onChange(inputValue);

    // Ensure the pattern is a RegExp
    if (validation?.pattern) {
      const pattern = new RegExp(validation.pattern); // Convert the string to a RegExp object

      if (!pattern.test(inputValue)) {
        setError(validation.errorMessage || 'Invalid input');
      } else {
        setError(null);
      }
    } else {
      setError(null); // If no validation pattern exists, clear the error
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
    <FormControl fullWidth={fullWidth} style={style} error={!!error}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <label htmlFor={name} style={{ fontSize: '12px' }}>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </label>
        {helperText && <HelperTooltip helperText={helperText} />}
      </div>
      <TextField
        id={name}
        name={name}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        onFocus={handleFocus}
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
        sx={{
          '& .MuiInputBase-input': { fontSize: '12px', padding: '4px 8px' },
          '& .MuiFormHelperText-root': { fontSize: '10px', margin: '0px' },
        }}
      />
      {/* {error && <FormHelperText sx={{ margin: '0px', fontSize: '10px' }}>{error}</FormHelperText>} */}
      <ErrorTooltip error={error} />
    </FormControl>
  );
};

export default CustomDatePicker;
