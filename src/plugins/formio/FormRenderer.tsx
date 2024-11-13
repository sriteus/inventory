import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import MyInput from './components/MyInput';
import Testingform from './components/testingform';

interface FormField {
  name: string;
  label: string;
  type: string;
}

interface FormSchema {
  fields: FormField[];
}

interface FormRendererProps {
  schema: FormSchema;
}

const FormRenderer: React.FC<FormRendererProps> = ({ schema }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Form Renderer
      </Typography>
      <Testingform />
      {schema.fields
        .filter((field) => ['text', 'number', 'email'].includes(field.type))
        .map((field) => (
          <MyInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            onChange={handleChange}
          />
        ))}
    </Box>
  );
};

export default FormRenderer;
