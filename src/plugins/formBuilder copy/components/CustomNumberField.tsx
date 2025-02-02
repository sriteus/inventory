import React, { useState } from 'react';
import { TextField, FormControl, FormHelperText } from '@mui/material';
import HelperTooltip from './HelperToolTip';
import ErrorTooltip from './ErrorTooltip';

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
    addAttributes?: Record<string, any>;
    helperText?: string;
    disabled?: any;
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
      console.log(inputValue, pattern);
      if (!pattern.test(inputValue)) {
        setError(validation.errorMessage || 'Invalid input');
      } else {
        setError(null);
      }
    } else {
      setError(null); // If no validation pattern exists, clear the error
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
    <FormControl fullWidth={fullWidth} sx={style} required={required} error={!!error}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <label htmlFor={name} style={{ fontSize: '12px' }}>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </label>
        {helperText && <HelperTooltip helperText={helperText} />}
      </div>

      <TextField
        id={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...addAttributes}
        fullWidth={fullWidth}
        size={size}
        sx={{
          '& .MuiInputBase-input': { fontSize: '12px', padding: '4px 8px' },
          '& .MuiFormHelperText-root': { fontSize: '10px', margin: '0px' },
        }}
        error={!!error}
        helperText={error}
        type="number"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {/* {error && <FormHelperText sx={{ margin: '0px', fontSize: '12px' }}>{error}</FormHelperText>} */}
      <ErrorTooltip error={error} />
    </FormControl>
  );
};

export default CustomNumberField;
