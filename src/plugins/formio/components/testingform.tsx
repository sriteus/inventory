/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
// import 'bootstrap/dist/css/bootstrap.min.css';

import type { UiSchema, RJSFSchema } from '@rjsf/utils';
import { useState } from 'react';
// import { Form } from '@rjsf/material-ui';
// import { Form } from '@rjsf/bootstrap-4';
// import Form from '@rjsf/antd';
// import Form from '@rjsf/mui';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

// Custom ObjectFieldTemplate to arrange fields in rows of 3
const ObjectFieldTemplate = ({ properties }: any) => (
  // <Box display="flex" flexWrap="wrap" gap={2}>
  //   {properties.map((element: any) => (
  //     <Box key={element.name} flex="1 1 40%">
  //       {element.content}
  //     </Box>
  //   ))}
  // </Box>
  <Grid container spacing={2}>
    {properties.map((element: any, index: number) => (
      <Grid item xs={6} sm={6} md={4} gap={2} key={element.name}>
        {element.content}
      </Grid>
    ))}
  </Grid>
);

// Schema with 11 fields for testing
const schema: RJSFSchema = {
  title: 'Expanded Form',
  type: 'object',
  properties: {
    firstName: { type: 'string', title: 'First Name', default: 'Chuck' },
    lastName: { type: 'string', title: 'Last Name' },
    email: { type: 'string', title: 'Email', format: 'email' },
    phone: { type: 'string', title: 'Phone', minLength: 10 },
    address: { type: 'string', title: 'Address' },
    city: { type: 'string', title: 'City' },
    state: { type: 'string', title: 'State' },
    zip: { type: 'string', title: 'ZIP Code' },
    country: { type: 'string', title: 'Country' },
    occupation: { type: 'string', title: 'Occupation' },
    company: { type: 'string', title: 'Company' },
  },
};

const uiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    submitText: 'Confirm Details',
    norender: false,
    props: {
      disabled: false,
      color: 'primary',
    },
  },
  firstName: { 'ui:autofocus': true },
  lastName: { 'ui:title': 'Surname' },
  email: { 'ui:options': { inputType: 'email' } },
  phone: { 'ui:options': { inputType: 'tel' } },
  address: {},
  city: {},
  state: {},
  zip: { 'ui:options': { inputType: 'number' } },
  country: {},
  occupation: {},
  company: {},
};

const Testingform = () => {
  const [formData, setFormData] = useState({
    firstName: 'Chuck',
    lastName: 'Norris',
    email: 'chuck@example.com',
    phone: '1234567890',
    address: '123 Street',
    city: 'Metropolis',
    state: 'TX',
    zip: '12345',
    country: 'USA',
    occupation: 'Martial Artist',
    company: 'Walker Texas Rangers',
  });

  const handleSubmit = ({ formData }: any) => {
    console.log('Submitted data:', formData);
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={(e) => setFormData(e.formData)}
      onSubmit={handleSubmit}
      validator={validator}
      liveValidate
      templates={{
        ObjectFieldTemplate,
      }}
    />
  );
};

export default Testingform;
