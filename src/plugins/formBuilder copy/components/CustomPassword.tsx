import React, { useState } from 'react';
import { TextField, FormControl, FormHelperText, InputAdornment } from '@mui/material';
import HelperTooltip from './HelperToolTip';
import ErrorTooltip from './ErrorTooltip';

interface PasswordFieldProps {
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
    helperText?: string; // Add helperText field
    disabled?: any;
  };
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
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
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value || ''}
        type={showPassword ? 'text' : 'password'}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        onFocus={handleFocus}
        size={size}
        {...addAttributes}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007BFF',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: 0,
                  margin: 0,
                }}
              >
                {showPassword ? (
                  <img
                    src="src/plugins/formBuilder/components/svg/openedeye.svg"
                    alt="Hidden"
                    style={{ width: '16px', height: '16px' }}
                  />
                ) : (
                  <img
                    src="src/plugins/formBuilder/components/svg/closedeye.svg"
                    alt="Shown"
                    style={{ width: '16px', height: '16px' }}
                  />
                )}
              </button>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '12px',
            padding: '4px 8px',
          },
          '& .MuiFormHelperText-root': {
            fontSize: '10px',
            margin: '0px',
          },
        }}
      />
      {/* {error && <FormHelperText sx={{ margin: '0px', fontSize: '10px' }}>{error}</FormHelperText>} */}
      <ErrorTooltip error={error} />
    </FormControl>
  );
};

export default PasswordField;
