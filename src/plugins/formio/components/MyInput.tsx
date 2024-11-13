import React from 'react';
import { TextField } from '@mui/material';

interface MyInputProps {
  label: string;
  name: string;
  type: string;
  onChange: (name: string, value: string) => void;
}

const MyInput: React.FC<MyInputProps> = ({ label, name, type, onChange }) => (
  <TextField
    label={label}
    variant="outlined"
    fullWidth
    type={type}
    onChange={(e) => onChange(name, e.target.value)}
  />
);

export default MyInput;
