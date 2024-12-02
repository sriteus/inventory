/* eslint-disable radix */
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { Box, Grid, Button } from '@mui/material';

import CustomSelect from '../components/CustomSelect';
import CustomTextField from '../components/CustomTextField';
import CustomFileUpload from '../components/CustomFileUpload';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomNumberField from '../components/CustomNumberField';
import CustomPassword from '../components/CustomPassword';
import CustomTextArea from '../components/CustomTextArea';

interface ColumnConfig {
  formid: string;
  sectionid: string;
  field: string;
  title: string;
  colsize: string;
  type: string;
  component: string;
  required: number;
  sortno: number;
  active: number;
  hint?: string;
  placeholder?: string;
  options?: any[];
  defaultvalue?: any;
  addattrs?: any;
}

// interface SectionConfig {
//   formid: string;
//   sectionid: string;
//   title: string;
//   columns: ColumnConfig[];
// }

// interface NewFormConfig {
//   formid: string;
//   title: string;
//   sections: SectionConfig[];
// }

interface FormBuilderProps {
  config: any;
  initialData?: Record<string, any>;
  customEvent?: (fieldName: string, fieldValue: any) => void;
  onKeyDown?: (fieldName: string, event: React.KeyboardEvent) => void;
  onKeyUp?: (fieldName: string, event: React.KeyboardEvent) => void;
  onBlur?: (fieldName: string, event: React.FocusEvent) => void;
  onFocus?: (fieldName: string, event: React.FocusEvent) => void;
}

export interface FormBuilderRef {
  addField: (field: ColumnConfig) => void;
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
    // Default to an empty array if sections is undefined
    const { sections = [] } = config;

    const [formData, setFormData] = useState<Record<string, any>>(() =>
      (sections || []).reduce(
        (acc: any, section: any) => {
          section.columns.forEach((column: any) => {
            acc[column.field] = initialData?.[column.field] || column.defaultvalue || '';
          });
          return acc;
        },
        {} as Record<string, any>
      )
    );

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

    const validateField = (column: ColumnConfig, value: any): string | null => {
      if (column.required && !value) {
        return `${column.title} is required`;
      }
      return null;
    };

    const handleFieldChange = (name: string, value: any) => {
      handleChange(name, value);
      const section = sections.find((sec: any) =>
        sec.columns.some((col: any) => col.field === name)
      );
      const column = section?.columns.find((col: any) => col.field === name);
      const error = column ? validateField(column, value) : null;
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const addField = (newField: ColumnConfig) => {
      const section = sections.find((sec: any) => sec.sectionid === newField.sectionid);
      if (section && !section.columns.some((col: any) => col.field === newField.field)) {
        section.columns.push(newField);
        setFormData((prevData) => ({
          ...prevData,
          [newField.field]: newField.defaultvalue || '',
        }));
      }
    };

    const removeField = (fieldName: string) => {
      const section = sections.find((sec: any) =>
        sec.columns.some((col: any) => col.field === fieldName)
      );
      if (section) {
        section.columns = section.columns.filter((col: any) => col.field !== fieldName);
        const updatedFormData = { ...formData };
        delete updatedFormData[fieldName];
        setFormData(updatedFormData);
      }
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

    const renderField = (column: ColumnConfig) => {
      const commonProps = {
        field: {
          label: column.title, // Mapping column title to label
          name: column.field, // Mapping column field to name
          placeholder: column.placeholder || '', // Optional placeholder
          required: column.required === 1, // Assuming '1' means required
          fullWidth: true, // You can make this configurable
          validation: column.addattrs?.validation || {}, // Optional validation
          helperText: column.hint, // If you have hints
          addAttributes: column.addattrs || {}, // Any additional attributes
          options: column.options, // Pass options from the column config
        },
        value: formData[column.field],
        onChange: (value: any) => handleFieldChange(column.field, value),
        onKeyDown: (event: React.KeyboardEvent) => handleKeyDown(column.field, event),
        onKeyUp: (event: React.KeyboardEvent) => handleKeyUp(column.field, event),
        onBlur: (event: React.FocusEvent) => handleBlur(column.field, event),
        onFocus: (event: React.FocusEvent) => handleFocus(column.field, event),
      };

      switch (column.component) {
        case 'reactselect':
          return <CustomSelect {...commonProps} />;
        case 'textarea':
          return <CustomTextArea {...commonProps} />;
        case 'textfield':
          return <CustomTextField {...commonProps} />;
        case 'fileupload':
        case 'image':
          return <CustomFileUpload {...commonProps} />;
        case 'datepicker':
          return <CustomDatePicker {...commonProps} />;
        case 'number':
          return <CustomNumberField {...commonProps} />;
        case 'checkpassword':
          return <CustomPassword {...commonProps} />;
        default:
          return <CustomTextField {...commonProps} />;
      }
    };

    return (
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          border: '2px solid #ccc',
          borderRadius: '8px',
          padding: 1,
        }}
      >
        {sections.length > 0 ? (
          sections.map((section: any) => (
            <Box
              key={section.sectionid}
              sx={{
                padding: 1, // Reduced padding
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginBottom: 1, // Reduced bottom margin
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginBottom: -3, // Minimal gap between title and content
                  marginTop: -2,
                }}
              >
                <h2>{section.title}</h2>
              </Box>
              <Grid container spacing={1}>
                {' '}
                {/* Reduced grid spacing further */}
                {section.columns.map((column: any) => (
                  <Grid
                    item
                    xs={12}
                    sm={column.colsize ? parseInt(column.colsize.replace('col-', '')) : 12}
                    key={column.field}
                    sx={{ py: 0.5 }} // Reduced vertical padding in grid items
                  >
                    {renderField(column)}
                    {formErrors[column.field] && (
                      <Box sx={{ color: 'red', fontSize: '0.75rem', mt: 0.25 }}>
                        {formErrors[column.field]}
                      </Box>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Box>No sections available.</Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log('Saved Form Data:', formData)}
          sx={{ mt: 1 }} // Reduced top margin
          disabled={!isFormValid}
        >
          Save
        </Button>
      </Box>
    );
  }
);

export default FormBuilder;
