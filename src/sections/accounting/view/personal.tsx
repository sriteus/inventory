/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import { useRef, useState, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';
import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';

const Personal = (inData: any, schema: any) => {
  const formRef = useRef<FormBuilderRef>(null);
  const [formDetails, setFormDetails] = useState(inData.schema); // State to hold form configuration
  // const [formDetails, setFormDetails] = useState(null); // State to hold form configuration
  const handleOnChange = (data: Record<string, any>) => {
    console.log('Form data changed:', data);
  };

  const handleFocus = (fieldName: string, event: any) => {
    // console.log('Accounting Focus:', {
    //   fieldName,
    //   value: event.target.value,
    //   timestamp: new Date().toISOString(),
    // });
  };

  const handleKeyDown = (fieldName: string, event: any) => {
    // if (event.key === 'Tab') {
    //   console.log(`Enter pressed on ${fieldName}`);
    // }
  };

  const handleKeyUp = (fieldName: string, event: any) => {
    // console.log('Accounting KeyUp:', {
    //   fieldName,
    //   key: event.key,
    //   value: event.target.value,
    //   timestamp: new Date().toISOString(),
    // });
  };

  const handleBlur = (fieldName: string, event: any) => {
    const value = event.target.value;

    // Retrieve the current errors
    const currentErrors = formRef.current?.getFormErrors() || {};

    // Initialize a copy of current errors to update
    const updatedErrors = { ...currentErrors };

    // Example logic to handle errors based on fieldName
    if (fieldName === 'person_age') {
      const age = parseInt(value, 10);
      if (isNaN(age) || age < 0) {
        updatedErrors[fieldName] = 'Please enter a valid age';
      } else {
        delete updatedErrors[fieldName]; // Remove error if valid
      }
    }

    if (fieldName === 'person_name') {
      if (value.length >= 50) {
        updatedErrors[fieldName] = 'Please enter a valid NAME';
      } else {
        delete updatedErrors[fieldName]; // Remove error if valid
      }
    }
    // Date of Birth validation (DOB) for year >= 2000
    if (fieldName === 'person_dob') {
      const dob = new Date(value);
      const year = dob.getFullYear();
      if (isNaN(dob.getTime()) || year < 2000) {
        updatedErrors[fieldName] = 'Date of birth must be in the year 2000 or later';
      } else {
        delete updatedErrors[fieldName]; // Remove error if valid
      }
    }
    // Update form errors in the formRef
    if (formRef.current) {
      formRef.current.setFormErrors(updatedErrors);
    }
  };

  const handleAddField = (newField: any) => {
    formRef.current?.addField(newField);
  };

  const handleRemoveField = (fieldName: string) => {
    formRef.current?.removeField(fieldName);
  };

  // Fetch form configuration from the API

  // Register event handlers once `formRef.current` is set
  useEffect(() => {
    if (formRef.current) {
      formRef.current.onChange(handleOnChange);
      formRef.current.onKeyDown(handleKeyDown);
      formRef.current.onKeyUp(handleKeyUp);
      formRef.current.onBlur(handleBlur);
      formRef.current.onFocus(handleFocus);
      console.log('All event handlers registered');
    }
  }, []);

  const initialData = {
    person_id: 3,
    person_name: 'Sam',
    person_age: 55,
    person_dob: '2024-12-20',
  };
  console.log('IAAMAMMAMAMAMAMAM', inData.inData);
  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Personal's Form
      </Typography>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: '100%', marginBottom: '30px' }}>
          {formDetails && (
            <FormBuilder ref={formRef} config={formDetails} initialData={inData.inData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Personal;
