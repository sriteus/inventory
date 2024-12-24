import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { fetchFormDetails } from '../api/fetchFormDetails';
import FormBuilder, { FormBuilderRef } from './FormBuilder';
import TableBuilder2 from './TableBuilder2';

interface FilterFormBuilderProps {
  formId: string;
  onSubmit: (formData: Record<string, any>) => void;
  filterData?: any;
}

const FilterFormBuilder: React.FC<FilterFormBuilderProps> = ({ formId, onSubmit, filterData }) => {
  const formBuilderRef = useRef<FormBuilderRef>(null);
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFilter, setIsFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(filterData);
      try {
        const formDetails = await fetchFormDetails({
          formId: formId,
          endpoint: 'formio',
          action: 'schema',
          initData: filterData,
        });
        if (formDetails.type === 'F') {
          setIsFilter(true);
        }
        setSchema(formDetails);
      } catch (error) {
        console.error('Error fetching form details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!schema) {
    return <div>Error loading form schema.</div>;
  }
  const handleFormSubmit = (formData: Record<string, any>) => {
    onSubmit(formData);
  };

  return (
    <>
      <FormBuilder ref={formBuilderRef} config={schema} filterSave={handleFormSubmit} />
    </>
  );
};

export default FilterFormBuilder;
