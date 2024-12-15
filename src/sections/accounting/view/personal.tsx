/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import { useRef, useState, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import Adaz from 'src/plugins/muigrid/Adaz';
import { DashboardContent } from 'src/layouts/dashboard';
import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';
import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';

const Personal = () => {
  const formRef = useRef<FormBuilderRef>(null);
  const [formDetails, setFormDetails] = useState(null); // State to hold form configuration
  const [loading, setLoading] = useState(true); // State to manage loading

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
    if (fieldName === 'person_age') {
      const age = parseInt(event.target.value, 10);
      if (!isNaN(age) && age < 18) {
        alert('Age must be greater than or equal to 18.');
      }
    }
  };
  const handleAddField = (newField: any) => {
    formRef.current?.addField(newField);
  };

  const handleRemoveField = (fieldName: string) => {
    formRef.current?.removeField(fieldName);
  };

  // Fetch form configuration from the API
  useEffect(() => {
    const loadFormConfig = async () => {
      try {
        const config = await fetchFormDetails({
          formId: 'per_details',
          endpoint: 'formio',
          action: 'schema',
        });
        setFormDetails(config);
      } catch (error) {
        console.error('Failed to load form configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormConfig();
  }, []);

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
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Accounting Form
      </Typography>
      <div style={{ width: '40%', marginBottom: '30px' }}>
        {formDetails && <FormBuilder ref={formRef} config={formDetails} />}
      </div>
    </div>
  );
};

export default Personal;
