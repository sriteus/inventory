import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';
import React, { useMemo, useState, useEffect } from 'react';

import { fetchFormDetails } from 'src/plugins/formBuilder/api/fetchFormDetails';
import { fetchTableDetails } from 'src/plugins/formBuilder/api/fetchTableDetails';

import Personal from './personal';

interface Row {
  person_id: number;
  person_name: string;
  person_age: number;
  person_dob: string;
}

interface SummaryRow {
  id: string;
  totalCount: number;
  averageAge: number;
}

const PersonalTable: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRowDetails, setSelectedRowDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await fetchTableDetails({
          formId: 'per_details',
          endpoint: 'formio',
          action: 'list',
        });
        const formDetails = await fetchFormDetails({
          formId: 'per_details',
          endpoint: 'formio',
          action: 'schema',
        });
        console.log('first', config);

        // Directly use the data if it is already parsed
        const transformedData = config.map((item: any) => ({
          person_id: item.person_id,
          person_name: item.person_name,
          person_age: item.person_age,
          person_dob: item.person_dob.split('T')[0],
        }));
        console.log(transformedData);

        setRows(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      { key: 'person_id', name: 'ID', resizable: true },
      { key: 'person_name', name: 'Name', editable: true },
      { key: 'person_age', name: 'Age', editable: true },
      { key: 'person_dob', name: 'Date of Birth' },
    ],
    []
  );

  const summaryRows = useMemo(
    (): SummaryRow[] => [
      {
        id: 'summary',
        totalCount: rows.length,
        averageAge:
          rows.length > 0 ? rows.reduce((sum, row) => sum + row.person_age, 0) / rows.length : 0,
      },
    ],
    [rows]
  );

  const handleRowsChange = (newRows: Row[]) => {
    setRows(newRows);
  };

  const handleCellClick = (args: any, event: React.MouseEvent) => {
    setSelectedRowDetails(args.row);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          height: 500,
          width: '40%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          onRowsChange={handleRowsChange}
          rowKeyGetter={(row) => row.person_id}
          bottomSummaryRows={summaryRows}
          className="rdg-light"
          onCellClick={handleCellClick}
          summaryRowHeight={25}
          rowHeight={25}
        />
      </div>
      <div
        style={{
          height: 500,
          width: '50%',
        }}
      >
        {selectedRowDetails && (
          <div>
            {/* <pre>{selectedRowDetails}</pre> */}
            <Personal inData={selectedRowDetails} />
            {/* <Adaz /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalTable;
