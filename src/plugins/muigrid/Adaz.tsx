/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-duplicates */

/* eslint-disable react/jsx-no-bind */
import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';
import React, { useMemo, useState } from 'react';
import 'react-data-grid/lib/styles.css';

interface Row {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  country: string;
}

interface SummaryRow {
  id: string;
  totalCount: number;
  totalAge: number;
}

const countries = ['USA', 'Canada', 'UK', 'France', 'Germany', 'Japan', 'Australia', 'India'];

function createRows(): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < 5; i++) {
    rows.push({
      id: i,
      firstName: `First ${i}`,
      lastName: `Last ${i}`,
      age: 20 + i,
      country: countries[0],
    });
  }
  return rows;
}

const Adaz: React.FC = () => {
  const [rows, setRows] = useState(createRows);

  const handleFocus = (cellKey: string, rowIndex: number) => {
    console.log(`Cell focused: ${cellKey}, Row: ${rowIndex}`);
  };

  const handleBlur = (cellKey: string, rowIndex: number) => {
    console.log(`Cell blurred: ${cellKey}, Row: ${rowIndex}`);
  };

  const columns = useMemo(
    () => [
      {
        key: 'id',
        name: 'ID',
        renderSummaryCell({ row }: { row: SummaryRow }) {
          return <strong>{row.totalCount} Total</strong>;
        },
      },
      {
        key: 'firstName',
        name: 'First Name',
        renderEditCell: (props: any) => (
          <input
            style={{ width: '100%', height: '100%', border: 'none' }}
            type="text"
            value={props.row.firstName}
            onFocus={() => handleFocus('firstName', props.rowIdx + 1)}
            onBlur={() => handleBlur('firstName', props.rowIndex)}
            onChange={(e) => props.onRowChange({ ...props.row, firstName: e.target.value })}
            autoFocus
          />
        ),
        editable: true,
      },
      {
        key: 'lastName',
        name: 'Last Name',
        renderEditCell: (props: any) => (
          <input
            style={{ width: '100%', height: '100%', border: 'none' }}
            type="text"
            value={props.row.lastName}
            onFocus={() => handleFocus('lastName', props.rowIndex)}
            onBlur={() => handleBlur('lastName', props.rowIndex)}
            onChange={(e) => props.onRowChange({ ...props.row, lastName: e.target.value })}
            autoFocus
          />
        ),
        editable: true,
      },
      {
        key: 'country',
        name: 'Country',
        renderEditCell: (props: any) => (
          <select
            style={{ width: '100%', height: '100%', border: 'none' }}
            value={props.row.country}
            onFocus={() => handleFocus('country', props.rowIndex)}
            onBlur={() => handleBlur('country', props.rowIndex)}
            onChange={(e) => props.onRowChange({ ...props.row, country: e.target.value })}
            autoFocus
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        ),
        editable: true,
      },
      {
        key: 'age',
        name: 'Age',
        renderEditCell: (props: any) => (
          <input
            style={{ width: '100%', height: '100%', border: 'none' }}
            type="number"
            value={props.row.age}
            onFocus={() => handleFocus('age', props.rowIndex)}
            onBlur={() => handleBlur('age', props.rowIndex)}
            onChange={(e) => props.onRowChange({ ...props.row, age: Number(e.target.value) })}
            autoFocus
          />
        ),
        editable: true,
        renderSummaryCell({ row }: { row: SummaryRow }) {
          return row.totalAge;
        },
      },
    ],
    []
  );

  const summaryRows = useMemo(
    (): readonly SummaryRow[] => [
      {
        id: 'total_0',
        totalCount: rows.length,
        totalAge: rows.reduce((sum, row) => sum + Number(row.age), 0),
      },
    ],
    [rows]
  );

  function handleRowsChange(newRows: Row[]) {
    // Check if the last row is completely filled
    const lastRow = newRows[newRows.length - 1];
    const isLastRowFilled =
      lastRow &&
      lastRow.firstName.trim() !== '' &&
      lastRow.lastName.trim() !== '' &&
      lastRow.country.trim() !== '' &&
      lastRow.age !== 0;

    if (isLastRowFilled) {
      // Add a new empty row
      newRows = [
        ...newRows,
        {
          id: newRows.length,
          firstName: '',
          lastName: '',
          age: 0,
          country: countries[0],
        },
      ];
    }

    console.log('Data changed:', newRows);
    setRows(newRows);
  }

  return (
    <div style={{ height: 350, width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={handleRowsChange}
        rowKeyGetter={(row) => row.id}
        bottomSummaryRows={summaryRows}
        className="rdg-light"
      />
    </div>
  );
};

export default Adaz;
