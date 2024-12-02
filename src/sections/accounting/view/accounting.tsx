/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import { useRef, useEffect, useState } from 'react';
import axios from 'axios';

import { Button, Typography } from '@mui/material';

import Adaz from 'src/plugins/muigrid/Adaz';
import { DashboardContent } from 'src/layouts/dashboard';
import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';

import { jsonTest } from './test';

const Accounting = () => {
  const formRef = useRef<FormBuilderRef>(null);
  const [formConfig, setFormConfig] = useState(null); // State to hold form configuration
  const [loading, setLoading] = useState(true); // State to manage loading

  const handleOnChange = (data: Record<string, any>) => {
    console.log('Form data changed:', data);
  };

  const handleFocus = (fieldName: string, event: any) => {
    console.log('Accounting Focus:', {
      fieldName,
      value: event.target.value,
      timestamp: new Date().toISOString(),
    });
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
    // console.log('Accounting Blur:', {
    //   fieldName,
    //   value: event.target.value,
    //   timestamp: new Date().toISOString(),
    // });
  };

  const handleAddField = (newField: any) => {
    formRef.current?.addField(newField);
  };

  const handleRemoveField = (fieldName: string) => {
    formRef.current?.removeField(fieldName);
  };

  const initialData = {
    name: 'Sartha',
    lastName: 'Doe',
    schoolName: 'ABC School',
    collegeName: 'XYZ College',
  };

  // Fetch form configuration from the API
  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8003/api/formio',
          {
            action: 'schema',
            formId: 'parentalinfo',
            data: {},
            initData: {},
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWdpc3RyYXRpb25pZCI6IjMiLCJlbWFpbCI6Im9yYUB1cHNjLmluIiwibmFtZSI6Ik9SQSBNYWluIiwiaWF0IjoxNzMyNjk5OTI1LCJleHAiOjE3MzMyOTk5MjV9.qsZeal3xWdm2bcpZ_O85w-H0L6x4JhHvTQZgx3OwV5w',
            },
          }
        );
        setFormConfig(response.data.data[0]); // Set the fetched form configuration
      } catch (error) {
        console.error('Error fetching form configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormConfig();
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

    // return () => {
    //   if (formRef.current) {
    //     formRef.current.onChange(null);
    //     formRef.current.onKeyDown(null);
    //     formRef.current.onKeyUp(null);
    //     formRef.current.onBlur(null);
    //     formRef.current.onFocus(null);
    //   }
    // };
  }, [formRef.current]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DashboardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Accounting Form
        </Typography>
        <div style={{ width: '70%', marginBottom: '30px' }}>
          {formConfig && (
            <FormBuilder ref={formRef} config={formConfig} initialData={initialData} />
          )}
        </div>

        <div style={{ width: '50%', display: 'flex', flexDirection: 'row', gap: '10px' }}>
          <Adaz />
        </div>
        <Button onClick={() => console.log(formRef.current?.getFormData())}>Get Values</Button>
      </DashboardContent>
    </div>
  );
};

export default Accounting;
