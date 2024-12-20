import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { fetchTableDetails } from 'src/plugins/formBuilder/api/fetchTableDetails';
import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';

interface TableBuilderProps {
  formId: string;
  typer: string;
  DetailsComponent?: any;
}

const TableBuilder = ({ formId, typer, DetailsComponent }: TableBuilderProps) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch column definitions
        const formDetails = await fetchFormDetails({
          formId,
          endpoint: 'formio',
          action: 'schema',
        });
        setSchema(formDetails);
        const columnsFromSchema = formDetails.sections.flatMap((section: any) =>
          section.columns
            .filter((col: any) => col.listview) // Include only list view columns
            .map((col: any) => ({
              key: col.field,
              name: col.title,
              editable: col.component === 'input' || col.component === 'number',
              resizable: true,
            }))
        );

        setColumns(columnsFromSchema);

        // Fetch row data
        const config = await fetchTableDetails({
          formId,
          endpoint: 'formio',
          action: 'list',
        });
        // Transform all date fields to a standard format (e.g., 'YYYY-MM-DD')
        const transformedData = config.map((item: any) => {
          const transformedItem = { ...item };
          Object.keys(transformedItem).forEach((key) => {
            if (
              typeof transformedItem[key] === 'string' &&
              transformedItem[key].match(/^\d{4}-\d{2}-\d{2}T/)
            ) {
              transformedItem[key] = transformedItem[key].split('T')[0]; // Extract date portion
            }
          });
          return transformedItem;
        });
        setRows(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading) return <div>Loading...</div>;
  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
      {typer === 'just_table' && (
        <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'auto' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            onRowsChange={setRows}
            // rowKeyGetter={(row: any) => row.per_name}
            rowKeyGetter={(row: any) => String(Object.values(row)[0])}
            className="rdg-dark"
            onCellClick={({ row }) => setSelectedRow(row)}
            summaryRowHeight={25}
            rowHeight={25}
          />
        </div>
      )}
      {typer === 'table_with_form' && (
        <div style={{ flex: 1, width: '30%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            onRowsChange={setRows}
            // rowKeyGetter={(row: any) => row.per_name}
            rowKeyGetter={(row: any) => String(Object.values(row)[0])}
            className="rdg-light"
            onCellClick={({ row }) => setSelectedRow(row)}
            summaryRowHeight={25}
            rowHeight={25}
          />
        </div>
      )}
      {selectedRow && typer === 'table_with_form' && (
        <div style={{ flex: 1, width: '70%', height: '100%', overflow: 'auto' }}>
          <DetailsComponent schema={schema} inData={selectedRow} />
        </div>
      )}
      {typer === 'just_form' && (
        <div style={{ flex: 1, width: '70%', height: '100%', overflow: 'auto' }}>
          <DetailsComponent schema={schema} inData={selectedRow} />
        </div>
      )}
    </div>
  );
};

export default TableBuilder;
