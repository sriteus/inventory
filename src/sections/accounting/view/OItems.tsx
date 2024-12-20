/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import { useRef, useState, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';
import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';

const OItems = (inData: any, schema: any) => {
  const formRef = useRef<FormBuilderRef>(null);
  const [formDetails, setFormDetails] = useState(inData.schema);
  const handleOnChange = (data: Record<string, any>) => {
    console.log('Form data changed:', data);
  };

  const handleFocus = (fieldName: string, event: any) => {};

  const handleKeyDown = (fieldName: string, event: any) => {};

  const handleKeyUp = (fieldName: string, event: any) => {};

  const handleBlur = (fieldName: string, event: any) => {
    const value = event.target.value;
    // Retrieve the current errors
    const currentErrors = formRef.current?.getFormErrors() || {};
    const updatedErrors = { ...currentErrors };
    if (fieldName === 'quantity') {
      const age = parseInt(value, 10);
      if (isNaN(age) || age < 0) {
        updatedErrors[fieldName] = 'Please enter a valid age Yolo';
      } else {
        delete updatedErrors[fieldName]; // Remove error if valid
      }
    }
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

export default OItems;
