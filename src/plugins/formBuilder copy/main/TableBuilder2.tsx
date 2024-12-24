import { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { fetchTableDetails } from 'src/plugins/formBuilder/api/fetchTableDetails';
import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';

interface TableBuilderProps {
  formId: string;
  onRowSelect: (selectedRow: any) => void; // Callback to pass selected row to parent
  filterData?: any;
}

const TableBuilder2 = ({ formId, onRowSelect, filterData }: TableBuilderProps) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
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
          initData: filterData,
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
        setFilteredRows(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    const filtered = rows.filter((row) =>
      Object.keys(updatedFilters).every((filterKey) =>
        String(row[filterKey] || '')
          .toLowerCase()
          .includes(updatedFilters[filterKey].toLowerCase())
      )
    );
    setFilteredRows(filtered);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Filter Bar */}
      {/* <div style={{ display: 'flex', gap: '1rem', marginBottom: '10px' }}>
        {columns.map((col: any) => (
          <input
            key={col.key}
            placeholder={`Filter by ${col.name}`}
            onChange={(e) => handleFilterChange(col.key, e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        ))}
      </div> */}

      {/* Data Grid */}
      <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'auto' }}>
        <DataGrid
          columns={columns}
          rows={filteredRows}
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
