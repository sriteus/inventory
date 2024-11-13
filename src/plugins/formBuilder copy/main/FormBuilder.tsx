/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { Box, Grid, Button } from '@mui/material';

import CustomSelect from '../components/CustomSelect';
import CustomTextField from '../components/CustomTextField';
import CustomNumberField from '../components/CustomNumberField';

interface Option {
  label: string;
  value: string | number;
}

interface ValidationRule {
  pattern?: RegExp;
  errorMessage?: string;
}

interface FieldConfig {
  type: 'text' | 'select' | 'number';
  label: string;
  name: string;
  required?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  options?: Option[];
  validation?: ValidationRule;
  size?: 'small' | 'medium';
  col?: number;
  addAttributes?: Record<string, any>;
}

interface FormBuilderProps {
  config: {
    fields: any[];
  };
  initialData?: Record<string, any>;
  customEvent?: (fieldName: string, fieldValue: any) => void;
}

export interface FormBuilderRef {
  addField: (field: FieldConfig) => void;
  removeField: (fieldName: string) => void;
  getFormData: () => Record<string, any>;
  onChange: (callback: (data: Record<string, any>) => void) => void;
}

const FormBuilder = forwardRef<FormBuilderRef, FormBuilderProps>(
  ({ config, initialData, customEvent }, ref) => {
    const { fields } = config;
    const [formData, setFormData] = useState<Record<string, any>>(() => {
      return fields.reduce(
        (acc, field) => {
          acc[field.name] = initialData?.[field.name] || '';
          return acc;
        },
        {} as Record<string, any>
      );
    });

    const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
    const onChangeCallbackRef = useRef<(data: Record<string, any>) => void>();

    useEffect(() => {
      if (initialData) {
        setFormData((prevData) => ({
          ...prevData,
          ...initialData,
        }));
      }
    }, [initialData]);

    const handleChange = (name: string, value: any) => {
      setFormData((prevData) => {
        const updatedData = { ...prevData, [name]: value };

        if (onChangeCallbackRef.current) {
          onChangeCallbackRef.current(updatedData); // Trigger the callback with updated form data
        }

        return updatedData;
      });

      if (customEvent) {
        customEvent(name, value);
      }
    };

    const validateField = (field: FieldConfig, value: any): string | null => {
      if (field.required && !value) {
        return `${field.label} is required`;
      }

      if (field.validation?.pattern && !field.validation.pattern.test(value)) {
        return field.validation.errorMessage || 'Invalid input';
      }

      return null;
    };

    const handleFieldChange = (name: string, value: any) => {
      handleChange(name, value);

      const field = fields.find((field) => field.name === name);
      const error = field ? validateField(field, value) : null;

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const addField = (newField: FieldConfig) => {
      // Ensure the field is not already in the configuration
      if (!fields.some((field) => field.name === newField.name)) {
        config.fields.push(newField);
        setFormData((prevData) => ({
          ...prevData,
          [newField.name]: '',
        }));
      }
    };

    const removeField = (fieldName: string) => {
      // Remove the field only if it exists
      const updatedFields = config.fields.filter((field) => field.name !== fieldName);
      const updatedFormData = { ...formData };
      delete updatedFormData[fieldName];

      config.fields = updatedFields;
      setFormData(updatedFormData);
    };

    const getFormData = () => formData;

    useImperativeHandle(ref, () => ({
      addField,
      removeField,
      getFormData,
      onChange: (callback: (data: Record<string, any>) => void) => {
        onChangeCallbackRef.current = callback;
      },
    }));

    const isFormValid = Object.values(formErrors).every((error) => error === null);

    const renderField = (field: FieldConfig) => {
      const commonProps = {
        field,
        value: formData[field.name],
        onChange: (value: any) => handleFieldChange(field.name, value),
      };

      switch (field.type) {
        case 'text':
          return <CustomTextField key={field.name} {...commonProps} />;
        case 'select':
          return <CustomSelect key={field.name} {...commonProps} />;
        case 'number':
          return <CustomNumberField key={field.name} {...commonProps} />;
        default:
          return null;
      }
    };

    return (
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={field.col || 12} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log('Saved Form Data:', formData)}
          sx={{ mt: 2 }}
          disabled={!isFormValid}
        >
          Save
        </Button>
      </Box>
    );
  }
);

export default FormBuilder;
