import React from 'react';

import TextField from '@mui/material/TextField';

interface TextInputProps {
  field: string;
  title: string;
  placeholder?: string;
  hint?: string;
  colSize?: string;
  required?: boolean;
  onChange?: (field: string, value: string) => void;
  onFocus?: (field: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  field,
  title,
  placeholder,
  hint,
  colSize = 'col-12',
  required,
  onChange,
  onFocus,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(field, e.target.value);
  };

  const handleFocus = () => {
    if (onFocus) onFocus(field);
  };

  return (
    <div className={`form-field ${colSize}`}>
      <TextField
        label={title}
        placeholder={placeholder}
        required={required}
        fullWidth
        onChange={handleChange}
        onFocus={handleFocus}
        helperText={hint}
      />
    </div>
  );
};

export default TextInput;
