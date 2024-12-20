/* eslint-disable react-hooks/exhaustive-deps */
import type { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';

import { useRef, useState, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import Adaz from 'src/plugins/muigrid/Adaz';
import { DashboardContent } from 'src/layouts/dashboard';
import FormBuilder from 'src/plugins/formBuilder/main/FormBuilder';
import TableBuilder from 'src/plugins/formBuilder/main/TableBuilder';
import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';

import Personal from './personal';
import PersonalTable from './PersonalTable';
import ItemsForm from './items';

const Accounting = () => {
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
    const loadFormConfig = async () => {
      try {
        const config = await fetchFormDetails({
          formId: 'items',
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
      <DashboardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Accounting Form
        </Typography>
        <div style={{ width: '100%', marginBottom: '30px' }}>
          <TableBuilder formId="items" typer="just_form" DetailsComponent={ItemsForm} />
          <TableBuilder formId="per_details" typer="table_with_form" DetailsComponent={Personal} />
          <TableBuilder formId="per_details" typer="just_the_table" />
        </div>
        <Button onClick={() => console.log(formRef.current?.getFormData())}>Get Values</Button>
      </DashboardContent>
    </div>
  );
};

export default Accounting;
