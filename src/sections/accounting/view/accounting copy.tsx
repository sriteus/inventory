/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import React, { useRef, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';

const Accounting = () => {
  const formRef = useRef<FormBuilderRef>(null);

  const formConfig = {
    fields: [
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        required: true,
        fullWidth: true,
        col: 6,
        validation: {
          pattern: /^[A-Za-z]+$/,
          errorMessage: 'First name should only contain letters',
        },
        size: 'small',
        addAttributes: {
          multiline: true, // Single-line input
          helperText: 'First name should only contain letters',
        },
      },
      {
        type: 'text',
        label: 'Last Name',
        name: 'lastName',
        required: true,
        fullWidth: true,
        col: 6,
        validation: {
          pattern: /^(?=.*[!@#$%^&*()_+={}:;'"<>,.?/~\\|]).*$/,
          errorMessage: 'Last name must contain at least one special character',
        },
        size: 'small',
      },
      {
        type: 'select',
        label: 'Country',
        name: 'country',
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
        addAttributes: {
          color: 'warning',
        },
      },
    ],
  };

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
      formRef.current.onChange(handleOnChange); // Register the onChange callback
    }
  }, []);

  const handleAddField = (newField: any) => {
    formRef.current?.addField(newField);
  };

  const handleRemoveField = (fieldName: string) => {
    formRef.current?.removeField(fieldName);
  };
  const initialData = {
    firstName: 'Sartha',
    lastName: 'Doe',
    country: 'IN',
    schoolName: 'ABC School',
    collegeName: 'XYZ College',
  };
  return (
    <DashboardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Accounting Form
      </Typography>
      <FormBuilder ref={formRef} config={formConfig} initialData={initialData} />
      <Button onClick={() => console.log(formRef.current?.getFormData())}>Get Values</Button>
    </DashboardContent>
  );
};

export default Accounting;
