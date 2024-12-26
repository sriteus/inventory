# Dynamic Form System Documentation

## Overview

A comprehensive React-based form system that provides dynamic form building, filtering, and table view capabilities. The system consists of four main components working together to create a flexible and powerful form management solution.

## Key Components

### 1. KyroBuilder (Main Component)

The core component that orchestrates the form system.

```typescript
interface KyroBuilderProps {
  formId: string; // Unique form identifier
  variant?: string; // Form variant type
  initialData?: Record<string, any>; // Initial form data
  onBlur?: Function; // Blur event handler
  onChange?: Function; // Change event handler
  onKeyDown?: Function; // Key down event handler
  onKeyUp?: Function; // Key up event handler
  onFocus?: Function; // Focus event handler
  filterInitData?: any; // Initial filter data
}
```

Features:

- Dynamic schema loading
- Form and table view integration
- Resizable split view
- Row selection handling
- Form state management

### 2. FormBuilder (Form Component)

Handles the rendering and management of form fields.

```typescript
interface FormBuilderProps {
  config: any; // Form configuration
  initialData?: Record<string, any>; // Initial form data
  customEvent?: Function; // Custom event handler
  onKeyDown?: Function; // Key down event handler
  onKeyUp?: Function; // Key up event handler
  onBlur?: Function; // Blur event handler
  onFocus?: Function; // Focus event handler
  filterSave?: Function; // Filter save handler
}
```

Features:

- Dynamic field rendering
- Validation system
- Error handling
- Form data management
- Multiple section support

### 3. FilterFormBuilder

Manages filter forms and their interactions.

```typescript
interface FilterFormBuilderProps {
  formId: string; // Form identifier
  onSubmit: (formData: Record<string, any>) => void; // Submit handler
  filterData?: any; // Initial filter data
}
```

Features:

- Filter-specific form handling
- Integration with main form builder
- Loading state management
- Schema-based filter generation

### 4. TableBuilder2

Handles data grid display and interactions.

```typescript
interface TableBuilderProps {
  formId: string; // Form identifier
  onRowSelect: (row: any) => void; // Row selection handler
  filterData?: any; // Filter data
}
```

Features:

- Dynamic column generation
- Data filtering
- Row selection
- Responsive grid layout

## Usage Example

```typescript
import { useRef } from 'react';
import { KyroBuilderRef } from './KyroBuilder';
import KyroBuilder from './KyroBuilder';

const MyPage = () => {
  const kyroBuilderRef = useRef<KyroBuilderRef>(null);

  const handleBlur = (fieldName: string, event: any) => {
    const value = event.target.value;
    const currentErrors = kyroBuilderRef.current?.getFormErrors() || {};
    const updatedErrors = { ...currentErrors };

    if (fieldName === 'model') {
      if (value === '1') {
        updatedErrors[fieldName] = 'You cant set the model to 1';
      } else {
        delete updatedErrors[fieldName];
      }
    }
    kyroBuilderRef.current?.setFormErrors(updatedErrors);
  };

  const handleFocus = (fieldName: string, event: any) => {
    console.log(`Field "${fieldName}" focused with value: ${event.target.value}`);
  };

  return (
    <div>
      <KyroBuilder
        ref={kyroBuilderRef}
        formId="products_data"
        onBlur={handleBlur}
        onFocus={handleFocus}
        filterInitData={{ company: 'apple' }}
      />
    </div>
  );
};
```

## API Reference

### KyroBuilder Methods

```typescript
interface KyroBuilderRef {
  addField: (field: any) => void;
  removeField: (fieldName: string) => void;
  getFormData: () => Record<string, any>;
  setFormErrors: (errors: Record<string, string | null>) => void;
  getFormErrors: () => Record<string, string | null>;
}
```

### Form Configuration Schema

```typescript
interface ColumnConfig {
  formid: string;
  sectionid: string;
  field: string;
  title: string;
  colsize: string;
  type: string;
  component: string;
  required: number;
  sortno: number;
  active: number;
  hint?: string;
  placeholder?: string;
  options?: any[];
  defaultvalue?: any;
  addattrs?: any;
}
```

## Form Views

The system supports multiple view types:

1. Combined Form and Table View

   - Split screen with resizable panels
   - Interactive row selection
   - Form editing capabilities

2. Filter Form View

   - Dedicated filtering interface
   - Real-time filter applications
   - Submit handler for filter changes

3. Table View
   - Data grid display
   - Column customization
   - Row selection handling

## State Management

The system manages several states:

- Form data state
- Error state
- Loading states
- Filter states
- Row selection state

## Event Handling

Comprehensive event system including:

- Blur events
- Focus events
- Change events
- Key events
- Custom events

## Dependencies

- React 18+
- react-data-grid
- @mui/material
- TypeScript 4.5+

## Best Practices

1. Always provide unique formIds
2. Handle loading states appropriately
3. Implement proper error handling
4. Use TypeScript for better type safety
5. Manage form refs correctly
6. Handle validation appropriately

## Error Handling

The system includes built-in error handling for:

- Schema loading errors
- Validation errors
- API errors
- Data loading errors
