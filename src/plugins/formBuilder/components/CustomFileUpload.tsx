import React, { useState } from 'react';
import { Box, Button, TextField, Typography, FormControl } from '@mui/material';
import HelperTooltip from './HelperToolTip';

interface CustomFileUploadProps {
  field: {
    label: string;
    name: string;
    required?: boolean;
    fullWidth?: boolean;
    style?: React.CSSProperties;
    validation?: {
      allowedTypes?: string[];
      maxSize?: number; // in bytes
      errorMessage?: string;
    };
    size?: 'small' | 'medium';
    addAttributes?: Record<string, any>;
    helperText?: string;
  };
  value: File | null;
  onChange: (value: File | null) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const CustomFileUpload: React.FC<CustomFileUploadProps> = ({
  field,
  value,
  onChange,
  onKeyDown,
  onKeyUp,
  onBlur,
  onFocus,
}) => {
  const { label, name, required, fullWidth, style, validation, size, addAttributes, helperText } =
    field;
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // File validation
    if (file) {
      if (validation) {
        // Check file type
        if (validation.allowedTypes && !validation.allowedTypes.includes(file.type)) {
          setError(validation.errorMessage || 'Invalid file type');
          onChange(null); // Reset the value
          return;
        }
        // Check file size
        if (validation.maxSize && file.size > validation.maxSize) {
          setError(validation.errorMessage || 'File is too large');
          onChange(null); // Reset the value
          return;
        }
      }
      setError(null);
      onChange(file);
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
    <FormControl fullWidth={fullWidth} sx={style} required={required} error={!!error}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <label htmlFor={name} style={{ fontSize: '12px' }}>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </label>
        {helperText && <HelperTooltip helperText={helperText} />}
      </div>

      <Button variant="outlined" component="label" size={size} fullWidth>
        Upload File
        <input
          id={name}
          type="file"
          name={name}
          hidden
          onChange={handleFileChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...addAttributes}
        />
      </Button>
      {value && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {value.name}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </FormControl>
  );
};

export default CustomFileUpload;
