# Form Builder Plugin

The **Form Builder Plugin** is a React-based dynamic form creation utility. It allows you to generate, customize, and handle form submissions seamlessly using configurations. This documentation explains how to use the plugin, from setting up to implementing custom features.

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
   - [Basic Example](#basic-example)
   - [Form Configuration Structure](#form-configuration-structure)
3. [Components](#components)
4. [API Reference](#api-reference)
   - [Props](#props)
   - [Ref Methods](#ref-methods)
5. [Customizing Form Fields](#customizing-form-fields)
6. [Event Handling](#event-handling)
7. [Validation and Error Handling](#validation-and-error-handling)
8. [Sample Project Structure](#sample-project-structure)

---

## Installation

1. Clone the repository or add the code to your project.
2. Install the required dependencies:

   ```bash
   npm install @mui/material @mui/lab react react-dom
   ```

3. Ensure you have the supporting components like `CustomSelect`, `CustomTextField`, etc., or replace them with your preferred alternatives.

---

## Usage

### Basic Example

Here is a minimal example of how to use the **Form Builder**:

```tsx
import React, { useRef } from 'react';
import FormBuilder, { FormBuilderRef } from './path/to/FormBuilder';

const formConfig = {
  formid: 'userForm',
  title: 'User Information',
  pkeys: 'id',
  sections: [
    {
      sectionid: 'personalInfo',
      title: 'Personal Information',
      columns: [
        {
          formid: 'userForm',
          sectionid: 'personalInfo',
          field: 'name',
          title: 'Full Name',
          colsize: 'col-6',
          type: 'text',
          component: 'textfield',
          required: 1,
          placeholder: 'Enter your full name',
        },
        {
          formid: 'userForm',
          sectionid: 'personalInfo',
          field: 'email',
          title: 'Email Address',
          colsize: 'col-6',
          type: 'email',
          component: 'textfield',
          required: 1,
          placeholder: 'Enter your email address',
        },
      ],
    },
  ],
};

const MyFormPage = () => {
  const formRef = useRef<FormBuilderRef>(null);

  const handleFormSubmit = () => {
    if (formRef.current) {
      const formData = formRef.current.getFormData();
      console.log('Form Data:', formData);
    }
  };

  return (
    <div>
      <h1>User Form</h1>
      <FormBuilder ref={formRef} config={formConfig} />
      <button onClick={handleFormSubmit}>Submit</button>
    </div>
  );
};

export default MyFormPage;
```

### Form Configuration Structure

#### Example Configuration Object

```js
const formConfig = {
  formid: 'exampleForm',
  title: 'Example Form',
  pkeys: 'id', // Primary key(s), comma-separated
  sections: [
    {
      sectionid: 'section1',
      title: 'Section 1',
      columns: [
        {
          field: 'username',
          title: 'Username',
          type: 'text',
          component: 'textfield',
          required: 1,
          placeholder: 'Enter your username',
        },
        {
          field: 'password',
          title: 'Password',
          type: 'password',
          component: 'checkpassword',
          required: 1,
          placeholder: 'Enter your password',
        },
      ],
    },
  ],
};
```

### Notes

- Each `section` contains a `columns` array defining individual fields.
- Components are mapped via the `component` property (e.g., `textfield`, `reactselect`).
- Use the `pkeys` property to set primary key fields for edit modes.

---

## Components

The plugin uses custom components for field rendering. Replace these with your implementations if necessary:

1. **`CustomTextField`**: For input fields.
2. **`CustomSelect`**: For dropdowns.
3. **`CustomDatePicker`**: For date inputs.
4. **`CustomFileUpload`**: For file uploads.
5. **`CustomPassword`**: For password fields.
6. **`CustomTextArea`**: For multi-line text input.

---

## API Reference

### Props

| Prop Name     | Type                         | Description                           |
| ------------- | ---------------------------- | ------------------------------------- |
| `config`      | `object`                     | The form configuration object.        |
| `initialData` | `Record<string, any>`        | Pre-filled form data (for edit mode). |
| `customEvent` | `(fieldName, value) => void` | Callback for custom field events.     |
| `onKeyDown`   | `(fieldName, event) => void` | Callback for keydown events.          |
| `onKeyUp`     | `(fieldName, event) => void` | Callback for keyup events.            |
| `onBlur`      | `(fieldName, event) => void` | Callback for blur events.             |
| `onFocus`     | `(fieldName, event) => void` | Callback for focus events.            |

### Ref Methods

| Method        | Description                            |
| ------------- | -------------------------------------- |
| `addField`    | Adds a new field dynamically.          |
| `removeField` | Removes an existing field by name.     |
| `getFormData` | Retrieves the current form data.       |
| `onChange`    | Sets a callback for form data changes. |
| `onKeyDown`   | Sets a callback for keydown events.    |
| `onKeyUp`     | Sets a callback for keyup events.      |
| `onBlur`      | Sets a callback for blur events.       |
| `onFocus`     | Sets a callback for focus events.      |

---

## Customizing Form Fields

You can customize field rendering by updating the `renderField` function within the plugin:

```tsx
const renderField = (column: ColumnConfig) => {
  switch (column.component) {
    case 'textfield':
      return <CustomTextField {...commonProps} />;
    // Add additional cases for new components
  }
};
```

---

## Event Handling

The Form Builder supports multiple event handlers:

- **Custom Events**: Use the `customEvent` prop for field-specific interactions.
- **Keyboard Events**: `onKeyDown` and `onKeyUp` allow monitoring of key inputs.
- **Focus Events**: Use `onFocus` and `onBlur` for focus-related interactions.

---

## Validation and Error Handling

Validation rules can be added using the `required` property or through custom logic in the `validateField` function:

```tsx
const validateField = (column: ColumnConfig, value: any): string | null => {
  if (column.required && !value) {
    return `${column.title} is required`;
  }
  return null;
};
```

Errors are displayed below each field:

```tsx
{
  formErrors[column.field] && (
    <Box sx={{ color: 'red', fontSize: '0.75rem', mt: 0.25 }}>{formErrors[column.field]}</Box>
  );
}
```

---

## Sample Project Structure

```plaintext
src/
|-- components/
|   |-- CustomSelect.tsx
|   |-- CustomTextField.tsx
|   |-- ...
|
|-- plugins/
|   |-- formBuilder/
|       |-- main/FormBuilder.tsx
|       |-- api/fetchFormDetails.ts
|
|-- pages/
|   |-- MyFormPage.tsx
```
