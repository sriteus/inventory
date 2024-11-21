/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { Box, Grid, Button } from '@mui/material';

import CustomSelect from '../components/CustomSelect';
import CustomTextField from '../components/CustomTextField';
import CustomFileUpload from '../components/CustomFileUpload';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomNumberField from '../components/CustomNumberField';

// interface Option {
//   label: string;
//   value: string | number;
// }

interface ValidationRule {
  pattern?: RegExp;
  errorMessage?: string;
}

interface FieldConfig {
  type: 'text' | 'select' | 'number' | 'file' | 'date';
  label: string;
  name: string;
  required?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  options?: [];
  validation?: ValidationRule;
  size?: 'small' | 'medium';
  col?: number;
  addAttributes?: Record<string, any>;
  helperText?: string;
}

interface FormBuilderProps {
  config: {
    fields: any[];
  };
  initialData?: Record<string, any>;
  customEvent?: (fieldName: string, fieldValue: any) => void;
  onKeyDown?: (fieldName: string, event: React.KeyboardEvent) => void;
  onKeyUp?: (fieldName: string, event: React.KeyboardEvent) => void;
  onBlur?: (fieldName: string, event: React.FocusEvent) => void;
  onFocus?: (fieldName: string, event: React.FocusEvent) => void;
}

export interface FormBuilderRef {
  addField: (field: FieldConfig) => void;
  removeField: (fieldName: string) => void;
  getFormData: () => Record<string, any>;
  onChange: (callback: (data: Record<string, any>) => void) => void;
  onKeyDown: (callback: (fieldName: string, event: React.KeyboardEvent) => void) => void;
  onKeyUp: (callback: (fieldName: string, event: React.KeyboardEvent) => void) => void;
  onBlur: (callback: (fieldName: string, event: React.FocusEvent) => void) => void;
  onFocus: (callback: (fieldName: string, event: React.FocusEvent) => void) => void;
}

const FormBuilder = forwardRef<FormBuilderRef, FormBuilderProps>(
  ({ config, initialData, customEvent, onKeyDown, onKeyUp, onBlur, onFocus }, ref) => {
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
    const onKeyDownCallbackRef = useRef<(fieldName: string, event: React.KeyboardEvent) => void>();
    const onKeyUpCallbackRef = useRef<(fieldName: string, event: React.KeyboardEvent) => void>();
    const onBlurCallbackRef = useRef<(fieldName: string, event: React.FocusEvent) => void>();
    const onFocusCallbackRef = useRef<(fieldName: string, event: React.FocusEvent) => void>();

    useEffect(() => {
      if (initialData) {
        setFormData((prevData) => ({
          ...prevData,
          ...initialData,
        }));
      }
    }, [initialData]);

    const handleFocus = (name: string, event: React.FocusEvent) => {
      if (onFocusCallbackRef.current) {
        onFocusCallbackRef.current(name, event);
      }
      if (onFocus) {
        onFocus(name, event);
      }
    };
    const handleChange = (name: string, value: any) => {
      setFormData((prevData) => {
        const updatedData = { ...prevData, [name]: value };
        if (onChangeCallbackRef.current) {
          onChangeCallbackRef.current(updatedData);
        }
        return updatedData;
      });

      if (customEvent) {
        customEvent(name, value);
      }
    };

    const handleKeyDown = (name: string, event: React.KeyboardEvent) => {
      if (onKeyDownCallbackRef.current) {
        onKeyDownCallbackRef.current(name, event);
      }
      if (onKeyDown) {
        onKeyDown(name, event);
      }
    };

    const handleKeyUp = (name: string, event: React.KeyboardEvent) => {
      if (onKeyUpCallbackRef.current) {
        onKeyUpCallbackRef.current(name, event);
      }
      if (onKeyUp) {
        onKeyUp(name, event);
      }
    };

    const handleBlur = (name: string, event: React.FocusEvent) => {
      if (onBlurCallbackRef.current) {
        onBlurCallbackRef.current(name, event);
      }
      if (onBlur) {
        onBlur(name, event);
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
      if (!fields.some((field) => field.name === newField.name)) {
        config.fields.push(newField);
        setFormData((prevData) => ({
          ...prevData,
          [newField.name]: '',
        }));
      }
    };

    const removeField = (fieldName: string) => {
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
      onKeyDown: (callback: (fieldName: string, event: React.KeyboardEvent) => void) => {
        onKeyDownCallbackRef.current = callback;
      },
      onKeyUp: (callback: (fieldName: string, event: React.KeyboardEvent) => void) => {
        onKeyUpCallbackRef.current = callback;
      },
      onBlur: (callback: (fieldName: string, event: React.FocusEvent) => void) => {
        onBlurCallbackRef.current = callback;
      },
      onFocus: (callback: (fieldName: string, event: React.FocusEvent) => void) => {
        onFocusCallbackRef.current = callback;
      },
    }));

    const isFormValid = Object.values(formErrors).every((error) => error === null);

    const renderField = (field: FieldConfig) => {
      const commonProps = {
        field,
        value: formData[field.name],
        onChange: (value: any) => handleFieldChange(field.name, value),
        onKeyDown: (event: React.KeyboardEvent) => handleKeyDown(field.name, event),
        onKeyUp: (event: React.KeyboardEvent) => handleKeyUp(field.name, event),
        onBlur: (event: React.FocusEvent) => handleBlur(field.name, event),
        onFocus: (event: React.FocusEvent) => handleFocus(field.name, event),
      };

      switch (field.type) {
        case 'text':
          return <CustomTextField key={field.name} {...commonProps} />;
        case 'date':
          return <CustomDatePicker key={field.name} {...commonProps} />;
        case 'file':
          return <CustomFileUpload key={field.name} {...commonProps} />;
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
