/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import { useRef, useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';

const ItemsForm = (inData: any, schema: any) => {
  console.log('AMIHEREEE');
  const formRef = useRef<FormBuilderRef>(null);
  const [formDetails, setFormDetails] = useState(inData.schema); // State to hold form configuration

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

  const handleBlur = (fieldName: string, event: any) => {
    const value = event.target.value;
    console.log('first i am age from blur at page', fieldName);

    // Retrieve the current errors
    const currentErrors = formRef.current?.getFormErrors() || {};

    // Initialize a copy of current errors to update
    const updatedErrors = { ...currentErrors };
    // Example logic to handle errors based on fieldName
    if (fieldName === 'person_age') {
      const age = parseInt(value, 10);
      console.log('first i am age from blur at page', age);
      if (isNaN(age) || age < 10) {
        updatedErrors[fieldName] = 'Please enter a valid ageeee';
      } else {
        delete updatedErrors[fieldName]; // Remove error if valid
      }
    }

    // Update form errors in the formRef
    if (formRef.current) {
      formRef.current.setFormErrors(updatedErrors);
    }
  };

  // Fetch form configuration from the API

  // Register event handlers once `formRef.current` is set
  useEffect(() => {
    if (formRef.current) {
      formRef.current.onChange(handleOnChange);
      formRef.current.onBlur(handleBlur);
      formRef.current.onFocus(handleFocus);
      console.log('All event handlers registered');
    }
  }, []);

  console.log('YYYYYYY', inData.inData);
  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Items's Form
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

export default ItemsForm;
