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
import { fetchFormDetails } from '../api/fetchFormDetails';
import { trimDateStrings } from '../formatters/dateTrimmer';
import { LoadingButton } from '@mui/lab';
import ErrorTooltip from '../components/ErrorTooltip';

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
  setFormErrors: (errors: Record<string, string | null>) => void; // Add this method to set form errors
  getFormErrors: () => any;
}

const FormBuilder = forwardRef<FormBuilderRef, FormBuilderProps>(
  ({ config, initialData, customEvent, onKeyDown, onKeyUp, onBlur, onFocus }, ref) => {
    // Default to an empty array if sections is undefined
    const formId = config.formid;
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
    const [pkeysFilled, setPkeysFilled] = useState(false);
    const [formMode, setFormMode] = useState('create');
    useEffect(() => {
      if (initialData) {
        setFormData((prevData) => ({
          ...prevData,
          ...initialData,
        }));
        setPkeysFilled(true);
        setFormMode('edit');
      }
    }, [initialData]);

    const validateAllFields = (): boolean => {
      const errors: Record<string, string | null> = {};

      sections.forEach((section: any) => {
        section.columns.forEach((column: ColumnConfig) => {
          const value = formData[column.field];
          const error = validateField(column, value); // Existing validation logic
          if (error) {
            errors[column.field] = error;
          }
        });
      });

      setFormErrors(errors);
      return Object.values(errors).every((error) => error === null);
    };

    const handleFocus = (name: string, event: React.FocusEvent) => {
      if (onFocusCallbackRef.current) {
        onFocusCallbackRef.current(name, event);
      }
      if (onFocus) {
        onFocus(name, event);
      }
    };

    const handleChange = (name: string, value: any) => {
      const column = sections
        .flatMap((section: any) => section.columns)
        .find((col: any) => col.field === name);

      // Convert the value to a number if the field is a 'number' type
      const parsedValue = column?.type === 'number' && value !== '' ? Number(value) : value;
      setFormData((prevData) => {
        const updatedData = { ...prevData, [name]: parsedValue };
        if (onChangeCallbackRef.current) {
          onChangeCallbackRef.current(updatedData);
        }
        return updatedData;
      });

      if (customEvent) {
        customEvent(name, parsedValue);
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

    const handleBlur = async (name: string, event: React.FocusEvent) => {
      if (onBlurCallbackRef.current) {
        onBlurCallbackRef.current(name, event);
      }
      if (onBlur) {
        onBlur(name, event);
      }
      if (formMode !== 'edit') {
        const pkeys = (config.pkeys || '').split(',').filter((key: string) => key.trim());

        const allPkeysFilled = pkeys.every((pkey: string | number) => {
          const value = formData[pkey];
          if (value === null || value === undefined) return false;
          if (typeof value === 'string') return value.trim() !== '';
          if (typeof value === 'number') return !isNaN(value);
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'object') return Object.keys(value).length > 0;
          return true; // Fallback for other types
        });
        setPkeysFilled(allPkeysFilled);
        if (allPkeysFilled) {
          try {
            // Build the initData object using the primary keys and their values from formData
            const initData = pkeys.reduce((acc: Record<string, any>, key: string) => {
              acc[key] = formData[key];
              return acc;
            }, {});
            // Make the API call
            const config = await fetchFormDetails({
              action: 'get',
              formId: formId,
              endpoint: 'formio',
              initData: initData, // Include the primary keys and their values
            });

            const trimmedResponse = trimDateStrings(config);

            // Set the trimmed response data to formData

            if (config !== undefined) {
              setFormMode('edit');
              setFormData((prevData) => ({
                ...prevData,
                ...trimmedResponse,
              }));
            } else {
              setFormMode('create');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            // Optionally handle the error (e.g., show a notification to the user)
          }
        }
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
      setFormErrors,
      getFormErrors: () => formErrors,
    }));

    // const isFormValid = pkeysFilled && Object.values(formErrors).every((error) => error === null);
    const isFormValid =
      sections
        .flatMap((section: any) => section.columns)
        .filter((column: any) => column.required === 1) // Check for required fields
        .every((column: any) => {
          const value = formData[column.field];
          return (
            value !== null &&
            value !== undefined &&
            (typeof value !== 'string' || value.trim() !== '') && // Check non-empty for strings
            (typeof value !== 'number' || !isNaN(value)) && // Check valid number
            (!Array.isArray(value) || value.length > 0) && // Check non-empty array
            (typeof value !== 'object' || Object.keys(value).length > 0) // Check non-empty object
          );
        }) && Object.values(formErrors).every((error) => error === null); // Make sure there are no errors

    const renderField = (column: ColumnConfig) => {
      const isPkey = (config.pkeys || '').split(',').includes(column.field);

      // Disable pkeys if formMode is 'edit', otherwise allow interaction
      // const isDisabled = formMode === 'edit' && isPkey;
      const isDisabled = isPkey ? formMode === 'edit' && isPkey : !pkeysFilled;
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
          type: column.type,
          disabled: isDisabled,
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
    const resetForm = () => {
      setFormData(() =>
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
      setFormMode('create');
    };
    const handleSubmit = async () => {
      if (!validateAllFields()) {
        alert('Please correct the errors before submitting.');
        return;
      }

      try {
        // Extract primary key values from formData
        const pkeys = (config.pkeys || '').split(',').filter((key: string) => key.trim());
        const initData = pkeys.reduce((acc: Record<string, any>, key: string) => {
          acc[key] = formData[key];
          return acc;
        }, {});

        // Filter out empty fields from the data
        const data = Object.keys(formData).reduce((acc: Record<string, any>, key: string) => {
          if (!pkeys.includes(key) && formData[key] !== '') {
            acc[key] = formData[key];
          }
          return acc;
        }, {});
        const response = await fetchFormDetails({
          action: 'upsert',
          formId: formId,
          endpoint: 'formio',
          initData,
          data,
        });

        // Handle success response
        console.log('Save successful:', response);
        alert('Form saved successfully!');
        resetForm();
        window.location.reload();
      } catch (error) {
        // Handle error response
        console.error('Error during save:', error);
        alert('An error occurred while saving the form.');
      }
    };

    const handleDelete = async () => {
      // Ask for user confirmation before proceeding with deletion
      const isConfirmed = window.confirm(
        'Are you sure you want to delete this form? This action cannot be undone.'
      );

      if (!isConfirmed) {
        return;
      }
      try {
        const pkeys = (config.pkeys || '').split(',').filter((key: string) => key.trim());
        const initData = pkeys.reduce((acc: Record<string, any>, key: string) => {
          acc[key] = formData[key];
          return acc;
        }, {});

        const response = await fetchFormDetails({
          action: 'del',
          formId: formId,
          endpoint: 'formio',
          initData,
        });

        console.log('Delete successful:', response);
        alert('Form Deleted Successfully!');
        resetForm();
      } catch (error) {
        console.error('Error during Delete:', error);
        alert('An error occurred while deleting the form.');
      }
    };

    const handleReset = () => {
      resetForm();
      setFormMode('create');
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
                    {formErrors[column.field] && <ErrorTooltip error={formErrors[column.field]} />}
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Box>No sections available.</Box>
        )}
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 1 }} // Reduced top margin
          disabled={!isFormValid} // Disabled unless pkeys are filled and all fields are valid
        >
          Save
        </LoadingButton>

        {formMode === 'edit' && (
          <>
            <LoadingButton
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ mt: 1, ml: 1 }} // Reduced top margin
              disabled={!isFormValid}
            >
              Delete
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="inherit"
              onClick={handleReset}
              sx={{ mt: 1, ml: 1 }} // Reduced top margin
              disabled={!isFormValid}
            >
              Reset
            </LoadingButton>
          </>
        )}
      </Box>
    );
  }
);

export default FormBuilder;
