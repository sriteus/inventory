/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-duplicates */
import 'react-data-grid/lib/styles.css';

/* eslint-disable react/jsx-no-bind */
import type { CellClickArgs, CellKeyDownArgs } from 'react-data-grid';

import DataGrid from 'react-data-grid';
import React, { useMemo, useState } from 'react';

import { TextField, Autocomplete } from '@mui/material';

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
  const [selectedRowDetails, setSelectedRowDetails] = useState<string | null>(null);

  const handleFocus = (cellKey: string, rowIndex: number) => {
    console.log(`Cell focused: ${cellKey}, Row: ${rowIndex}`);
  };

  const handleBlur = (cellKey: string, rowIndex: number) => {
    console.log(`Cell blurred: ${cellKey}, Row: ${rowIndex}`);
  };

  // Update onCellKeyDown handler to match the expected type
  const handleCellKeyDown = (
    args: CellKeyDownArgs<Row, SummaryRow>,
    event: React.KeyboardEvent
  ) => {
    console.log(`Key pressed: ${event.key}, Cell: ${args.column.key}, Row: ${args.rowIdx}`);
  };

  // New onCellClick handler
  const handleCellClick = (args: CellClickArgs<Row, SummaryRow>, event: React.MouseEvent) => {
    console.log(`Cell clicked: ${args.column.key}, Row: ${JSON.stringify(args.row, null, 2)}`);
    // Set the details of the clicked row in the state
    setSelectedRowDetails(JSON.stringify(args.row, null, 2)); // Convert row data to a formatted string
  };

  const columns = useMemo(
    () => [
      {
        key: 'id',
        name: 'ID',
        resizable: true,
        renderSummaryCell({ row }: { row: SummaryRow }) {
          return <strong>{row.totalCount} Total</strong>;
        },
      },
      {
        key: 'firstName',
        name: 'First Name',
        renderEditCell: (props: any) => (
          <Autocomplete
            size="small" // Make the autocomplete smaller
            sx={{
              width: '100%', // Use full width for the container
              height: 40, // Set a specific height to make it smaller
              padding: 0, // Remove padding
              marginTop: -1, // Adjust margin to make it look more compact
            }}
            value={props.row.firstName}
            onChange={(event, newValue) =>
              props.onRowChange({ ...props.row, firstName: newValue || '' })
            }
            options={['First 0', 'First 1', 'First 2', 'First 3', 'First 4']}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small" // Set the text input size to small
                sx={{ height: '30px' }} // Adjust the height of the input field itself
                onFocus={() => handleFocus('firstName', props.rowIdx + 1)}
                onBlur={() => handleBlur('firstName', props.rowIndex)}
                fullWidth
                autoFocus
              />
            )}
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
    <div style={{ height: 500, width: '100%', overflow: 'auto' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={handleRowsChange}
        rowKeyGetter={(row) => row.id}
        bottomSummaryRows={summaryRows}
        className="rdg-light"
        onCellKeyDown={handleCellKeyDown} // Add the onCellKeyDown event handler
        onCellClick={handleCellClick} // Add the onCellClick event handler
        summaryRowHeight={25}
        rowHeight={25}
      />
      {selectedRowDetails && (
        <div>
          <h3>Selected Row Details:</h3>
          <pre>{selectedRowDetails}</pre>
        </div>
      )}
    </div>
  );
};

export default Adaz;
