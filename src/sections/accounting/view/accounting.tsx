/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */

import { useRef, useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import TableBuilder from 'src/plugins/formBuilder/main/TableBuilder';
import FormBuilder, { FormBuilderRef } from 'src/plugins/formBuilder/main/FormBuilder';
import Items from './newItems';
import Personal from './personal';
import KyroBuilder from 'src/plugins/formBuilder/main/KyroBuilder';
import { jsonTest } from './test';
import OItems from './OItems';
import MyPage from './newItems';

const Accounting = () => {
  const ItemsForm = (inData: any) => {
    const formRef = useRef<FormBuilderRef>(null); // Replace with appropriate FormBuilderRef type if available
    const [formDetails, setFormDetails] = useState(inData.schema); // State to hold form configuration

    const handleOnChange = (data: Record<string, any>) => {
      console.log('Form data changed:', data);
    };

    const handleFocus = (fieldName: string, event: any) => {
      // Add focus logic here if needed
    };

    const handleBlur = (fieldName: string, event: any) => {
      const value = event.target.value;

      // Retrieve the current errors
      const currentErrors = formRef.current?.getFormErrors() || {};

      // Initialize a copy of current errors to update
      const updatedErrors = { ...currentErrors };

      // Example logic to handle errors based on fieldName
      if (fieldName === 'quantity') {
        const age = parseInt(value, 10);
        if (isNaN(age) || age < 0) {
          updatedErrors[fieldName] = 'Please enter a valid age Yo';
        } else {
          delete updatedErrors[fieldName]; // Remove error if valid
        }
      }

      // Update form errors in the formRef
      if (formRef.current) {
        formRef.current.setFormErrors(updatedErrors);
      }
    };

    // Register event handlers once `formRef.current` is set
    useEffect(() => {
      if (formRef.current) {
        formRef.current.onChange(handleOnChange);
        formRef.current.onBlur(handleBlur);
        formRef.current.onFocus(handleFocus);
        console.log('All event handlers registered');
      }
    }, []);

    return (
      <div>
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

  return (
    <div>
      <DashboardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Page
        </Typography>
        <div style={{ width: '100%', marginBottom: '30px' }}>
          {/* <TableBuilder formId="items" typer="table_with_form" DetailsComponent={ItemsForm} /> */}
          {/* <TableBuilder formId="items" typer="table_with_form" DetailsComponent={OItems} /> */}
          {/* <TableBuilder formId="per_details" typer="table_with_form" DetailsComponent={Personal} /> */}
          {/* <TableBuilder formId="per_details" typer="just_table" /> */}
          {/* <KyroBuilder formId="items" typer="form" /> */}
          {/* <Items /> */}
          <MyPage />
        </div>
      </DashboardContent>
    </div>
  );
};

export default Accounting;
