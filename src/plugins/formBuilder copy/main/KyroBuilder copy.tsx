import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react';
import FormBuilder, { FormBuilderRef } from './FormBuilder';
import { fetchFormDetails } from '../api/fetchFormDetails';
import TableBuilder2 from './TableBuilder2';
import { Typography } from '@mui/material';
import { trimDateStrings } from '../formatters/dateTrimmer';

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
    },
    ref
  ) => {
    const formBuilderRef = useRef<FormBuilderRef>(null);

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

    const [schema, setSchema] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [dividerPosition, setDividerPosition] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [rowInitialData, setRowInitialData] = useState<any>(null);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const formDetails = await fetchFormDetails({
            formId: formId,
            endpoint: 'formio',
            action: 'schema',
          });
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
    useEffect(() => {
      const fetchRowData = async () => {
        if (render_type === 'table_with_form' && selectedData && schema?.data?.[0]?.pkeys) {
          console.log('first');
          const pkeys = schema.data[0].pkeys.split(','); // Handle multiple keys if necessary
          const initData: Record<string, any> = {};

          pkeys.forEach((key: any) => {
            initData[key] = selectedData[key];
          });

          try {
            const config = await fetchFormDetails({
              action: 'get',
              formId: formId,
              endpoint: 'formio',
              initData, // Include the primary keys and their values
            });
            setRowInitialData(config.data || null); // Set the fetched data as the initial data
          } catch (error) {
            console.error('Error fetching row data:', error);
          }
        }
      };

      fetchRowData();
    }, [selectedData, schema, render_type, formId]);

    if (loading) return <div>Loading...</div>;

    const handleRowSelect = (row: any) => {
      setSelectedData(row);
      const fetchRowData = async () => {
        if (render_type === 'table_with_form' && selectedData) {
          const pkeys = schema.pkeys.split(','); // Handle multiple keys if necessary
          const initData: Record<string, any> = {};

          pkeys.forEach((key: any) => {
            initData[key] = selectedData[key];
          });
          try {
            const config = await fetchFormDetails({
              action: 'get',
              formId: formId,
              endpoint: 'formio',
              initData, // Include the primary keys and their values
            });
            const filteredData = trimDateStrings(config);
            setRowInitialData(filteredData || null); // Set the fetched data as the initial data
            console.log(config, selectedData);
          } catch (error) {
            console.error('Error fetching row data:', error);
          }
        }
      };
      fetchRowData();
    };

    const handleRowDeselect = () => {
      setSelectedData(null);
    };

    return (
      <>
        <div>
          <Typography variant="h6" sx={{ mb: 2, border: '1px solid red', textAlign: 'center' }}>
            {render_type}
          </Typography>
        </div>
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
              <div
                style={{
                  width: `${dividerPosition}%`,
                  overflow: 'auto',
                  paddingRight: '10px',
                }}
              >
                <TableBuilder2 formId={formId} onRowSelect={handleRowSelect} />
              </div>
              <div
                style={{
                  width: '5px',
                  cursor: 'col-resize',
                  backgroundColor: '#ccc',
                }}
                onMouseDown={handleMouseDown}
              ></div>
              <div
                style={{
                  width: `${100 - dividerPosition}%`,
                  overflow: 'auto',
                  paddingLeft: '10px',
                }}
              >
                {selectedData && rowInitialData && (
                  <>
                    <div style={{ flex: 1 }}>
                      <FormBuilder
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
