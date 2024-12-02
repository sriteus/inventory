/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import { useRef, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import Adaz from 'src/plugins/muigrid/Adaz';
import { DashboardContent } from 'src/layouts/dashboard';
import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';

import { jsonTest } from './test';

const Accounting = () => {
  const formRef = useRef<FormBuilderRef>(null);

  const school: any = {
    type: 'text',
    label: 'School Name',
    name: `schoolName`,
    fullWidth: true,
    col: 12,
    size: 'small',
    addAttributes: {
      color: 'warning',
    },
  };
  const college: any = {
    type: 'select',
    label: 'Counftry',
    name: 'ssss',
    fullWidth: true,
    required: true,
    col: 12,
    options: [
      { label: 'India', value: 'IN' },
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
      { label: 'Australia', value: 'AU' },
    ],
    validation: {
      pattern: /^(IN|US|CA|AU)$/,
      errorMessage: 'Please select a valid country',
    },
    size: 'small',
  };

  const handleOnChange = (data: Record<string, any>) => {
    console.log('Form data changed:', data);
    if (data.firstName === 'Sarthak') {
      handleAddField(school);
      handleRemoveField('ssss');
    } else if (data.firstName === 'Sonal') {
      handleAddField(college);
      handleRemoveField('schoolName');
    }
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
  const handleFocus = (fieldName: string, event: any) => {
    console.log('Accounting Focus:', {
      fieldName,
      value: event.currentTarget.value,
      timestamp: new Date().toISOString(),
    });
  };

  const handleKeyDown = (fieldName: string, event: any) => {
    // console.log('Accounting KeyDown:', {
    //   fieldName,
    //   key: event.key,
    //   value: event.currentTarget.value,
    //   timestamp: new Date().toISOString(),
    // });
    if (event.key === 'Tab') {
      console.log(`Enter pressed on ${fieldName}`);

      // Add your Enter key logic here
    }
  };

  const handleKeyUp = (fieldName: string, event: any) => {
    console.log('Accounting KeyUp:', {
      fieldName,
      key: event.key,
      value: event.currentTarget.value,
      timestamp: new Date().toISOString(),
    });
  };

  const handleBlur = (fieldName: string, event: any) => {
    console.log('Accounting Blur:', {
      fieldName,
      value: event.currentTarget.value,
      timestamp: new Date().toISOString(),
    });
  };
  const handleAddField = (newField: any) => {
    formRef.current?.addField(newField);
  };

  const handleRemoveField = (fieldName: string) => {
    formRef.current?.removeField(fieldName);
  };
  const initialData = {
    firstName: 'Sartha',
    lastName: 'Doe',
    // country: 'IN',
    schoolName: 'ABC School',
    collegeName: 'XYZ College',
  };
  return (
    <div>
      <DashboardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Accounting Form
        </Typography>
        <div style={{ width: '50%' }}>
          <FormBuilder ref={formRef} config={jsonTest.data[0]} initialData={initialData} />
          {/* <FormBuilder json={jsonTest} /> */}
        </div>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {/* <AccountingGrid /> */}
          <Adaz />
          {/* <Adaz /> */}
        </div>
        <Button onClick={() => console.log(formRef.current?.getFormData())}>Get Values</Button>
        {/* <TestGrid /> */}
      </DashboardContent>
    </div>
  );
};

export default Accounting;
