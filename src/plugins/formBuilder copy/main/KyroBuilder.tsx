import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react';
import FormBuilder, { FormBuilderRef } from './FormBuilder';
import { fetchFormDetails } from '../api/fetchFormDetails';
import TableBuilder2 from './TableBuilder2';
import { Typography } from '@mui/material';
import { trimDateStrings } from '../formatters/dateTrimmer';
import FilterFormBuilder from './FilterBuilder';

interface KyroBuilderProps {
  formId: string;
  variant: string;
  initialData?: Record<string, any>;
  selectedRow?: any;
}

export interface KyroBuilderRef {
  addField: (field: any) => void;
  removeField: (fieldName: string) => void;
  getFormData: () => Record<string, any>;
  setFormErrors: (errors: Record<string, string | null>) => void;
  getFormErrors: () => Record<string, string | null>;
}

const KyroBuilder = forwardRef<KyroBuilderRef, any>(
  (
    {
      formId,
      render_type,
      initialData,
      selectedRow,
      onBlur,
      onChange,
      onKeyDown,
      onKeyUp,
      onFocus,
      filterData,
    },
    ref
  ) => {
    const formBuilderRef = useRef<FormBuilderRef>(null);
    const [schema, setSchema] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [dividerPosition, setDividerPosition] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [rowInitialData, setRowInitialData] = useState<any>(null);
    const [formFlag, setFormFlag] = useState<boolean>(false);
    const [isLoadingRowData, setIsLoadingRowData] = useState<boolean>(false);
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<any>(null);

    useImperativeHandle(ref, () => ({
      addField: (field) => {
        formBuilderRef.current?.addField(field);
      },
      removeField: (fieldName) => {
        formBuilderRef.current?.removeField(fieldName);
      },
      getFormData: () => formBuilderRef.current?.getFormData() || {},
      setFormErrors: (errors) => {
        formBuilderRef.current?.setFormErrors(errors);
      },
      getFormErrors: () => formBuilderRef.current?.getFormErrors() || {},
      onChange: (callback: any) => {
        formBuilderRef.current?.onChange(callback);
      },
      onBlur: (callback: any) => {
        formBuilderRef.current?.onBlur(callback);
      },
      onKeyDown: (callback: any) => {
        formBuilderRef.current?.onKeyDown(callback);
      },
      onKeyUp: (callback: any) => {
        formBuilderRef.current?.onKeyUp(callback);
      },
      onFocus: (callback: any) => {
        formBuilderRef.current?.onFocus(callback);
      },
    }));

    useEffect(() => {
      const fetchData = async () => {
        try {
          const formDetails = await fetchFormDetails({
            formId: formId,
            endpoint: 'formio',
            action: 'schema',
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
    const handleMouseDown = () => setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newDividerPosition = (e.clientX / window.innerWidth) * 100;
      setDividerPosition(Math.min(80, Math.max(20, newDividerPosition)));
    };

    const handleMouseUp = () => setIsResizing(false);

    useEffect(() => {
      if (isResizing) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isResizing]);

    const handleRowSelect = async (row: any) => {
      // Reset form state before loading new data
      setFormFlag(false);
      setRowInitialData(null);
      setSelectedData(row);
      setIsLoadingRowData(true);

      try {
        if (render_type === 'table_with_form' && schema?.pkeys) {
          const pkeys = schema.pkeys.split(',');
          const initData: Record<string, any> = {};

          pkeys.forEach((key: any) => {
            initData[key] = row[key];
          });

          const config = await fetchFormDetails({
            action: 'get',
            formId: formId,
            endpoint: 'formio',
            initData,
          });

          const filteredData = trimDateStrings(config);
          setRowInitialData(filteredData);
          // Only show form after data is loaded
          setFormFlag(true);
        }
      } catch (error) {
        console.error('Error fetching row data:', error);
      } finally {
        setIsLoadingRowData(false);
      }
    };

    const handleRowDeselect = () => {
      setSelectedData(null);
      setRowInitialData(null);
      setFormFlag(false);
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    const handleFormSubmit = (formData: Record<string, any>) => {
      console.log('Submitted Data:', formData);
      const combinedData = { ...formData, ...filteredData, ...filterData };
      setFilteredData(combinedData);
    };
    console.log(filteredData);

    return (
      <>
        <div>
          <Typography variant="h6" sx={{ mb: 2, border: '1px solid black', textAlign: 'center' }}>
            {schema?.title}
          </Typography>
        </div>
        {(schema.formview === 'filter-form' ||
          schema.formview === 'filter-table-form' ||
          schema.formview === 'filter-table') && (
          <FilterFormBuilder
            formId={schema.formfilter}
            onSubmit={handleFormSubmit}
            filterData={filterData}
          />
        )}
        {filteredData ? (
          <div>
            {schema.formview === 'filter-form' && (
              <FormBuilder
                ref={formBuilderRef}
                config={schema}
                initialData={filteredData}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onFocus={onFocus}
              />
            )}{' '}
            {schema.formview === 'filter-table' && (
              <TableBuilder2
                formId={formId}
                onRowSelect={(row) => console.log('Selected Row:', row)}
                filterData={filteredData}
              />
            )}
            {schema.formview === 'filter-table-form' && (
              <>
                <FormBuilder
                  ref={formBuilderRef}
                  config={schema}
                  initialData={filteredData}
                  onBlur={onBlur}
                  onKeyDown={onKeyDown}
                  onKeyUp={onKeyUp}
                  onFocus={onFocus}
                />
                <TableBuilder2
                  formId={formId}
                  onRowSelect={(row) => console.log('Selected Row:', row)}
                  filterData={filteredData}
                />
              </>
            )}
          </div>
        ) : (
          <div>No</div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            padding: '10px',
          }}
        >
          {render_type === 'just_form' && (
            <FormBuilder
              ref={formBuilderRef}
              config={schema}
              initialData={initialData}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={onFocus}
            />
          )}

          {render_type === 'just_table' && (
            <TableBuilder2
              formId={formId}
              onRowSelect={(row) => console.log('Selected Row:', row)}
            />
          )}

          {render_type === 'table_with_form' && (
            <>
              <div style={{ width: `${dividerPosition}%`, overflow: 'auto', paddingRight: '10px' }}>
                <TableBuilder2 formId={formId} onRowSelect={handleRowSelect} />
              </div>
              <div
                style={{ width: '5px', cursor: 'col-resize', backgroundColor: '#ccc' }}
                onMouseDown={handleMouseDown}
              ></div>
              <div
                style={{
                  width: `${100 - dividerPosition}%`,
                  overflow: 'auto',
                  paddingLeft: '10px',
                }}
              >
                {isLoadingRowData ? (
                  <div>Loading row data...</div>
                ) : (
                  formFlag &&
                  selectedData &&
                  rowInitialData && (
                    <>
                      <div style={{ flex: 1 }}>
                        <FormBuilder
                          key={selectedData.id || JSON.stringify(selectedData)}
                          ref={formBuilderRef}
                          config={schema}
                          initialData={rowInitialData}
                          onBlur={onBlur}
                          onKeyDown={onKeyDown}
                          onKeyUp={onKeyUp}
                          onFocus={onFocus}
                        />
                      </div>
                      <div
                        style={{
                          borderTop: '1px solid #e5e7eb',
                          padding: '16px 0',
                          marginTop: '16px',
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={handleRowDeselect}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Close Form
                        </button>
                      </div>
                    </>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
);

export default KyroBuilder;
