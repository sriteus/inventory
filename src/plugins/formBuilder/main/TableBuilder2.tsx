import { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { fetchTableDetails } from 'src/plugins/formBuilder/api/fetchTableDetails';
import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';

interface TableBuilderProps {
  formId: string;
  onRowSelect: (selectedRow: any) => void; // Callback to pass selected row to parent
}

const TableBuilder2 = ({ formId, onRowSelect }: TableBuilderProps) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formDetails = await fetchFormDetails({
          formId,
          endpoint: 'formio',
          action: 'schema',
        });
        setSchema(formDetails);
        const columnsFromSchema = formDetails.sections.flatMap((section: any) =>
          section.columns
            .filter((col: any) => col.listview)
            .map((col: any) => ({
              key: col.field,
              name: col.title,
              editable: col.component === 'input' || col.component === 'number',
              resizable: true,
            }))
        );
        setColumns(columnsFromSchema);

        const config = await fetchTableDetails({
          formId,
          endpoint: 'formio',
          action: 'list',
        });
        const transformedData = config.map((item: any) => {
          const transformedItem = { ...item };
          Object.keys(transformedItem).forEach((key) => {
            if (
              typeof transformedItem[key] === 'string' &&
              transformedItem[key].match(/^\d{4}-\d{2}-\d{2}T/)
            ) {
              transformedItem[key] = transformedItem[key].split('T')[0];
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
      <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'auto' }}>
        <DataGrid
          columns={columns}
          rows={rows}
          onRowsChange={setRows}
          rowKeyGetter={(row: any) => String(Object.values(row)[0])}
          className="rdg-light"
          onCellClick={({ row }) => onRowSelect(row)} // Pass the selected row to the parent
          summaryRowHeight={25}
          rowHeight={25}
        />
      </div>
    </div>
  );
};

export default TableBuilder2;
