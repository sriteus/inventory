import { useRef } from 'react';

import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import DataGridBuilder from '../main/DataGridBuilder';

import type { DataGridBuilderRef } from '../main/DataGridBuilder';

const AccountingGrid = () => {
  const gridRef = useRef<DataGridBuilderRef>(null);

  const gridConfig = {
    columns: [
      { field: 'id', headerName: 'ID', type: 'number', editable: false, required: true, width: 50 },
      { field: 'name', headerName: 'Name', type: 'string', editable: true, required: true },
      {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        editable: true,
        align: 'center',
        headerAlign: 'center',
        width: 80,
      },
      {
        field: 'date',
        headerName: 'DOB',
        type: 'string',
        editable: true,
        width: 100,
        headerAlign: 'center',
      },
    ],
    rows: [
      { id: 1, name: 'Alice', age: 25, date: '2024-01-01' },
      { id: 2, name: 'Bob', age: 30, date: '2024-02-01' },
    ],
    showActionColumn: true, // Add this to enable/disable the Action column
  };

  const handleSave = (updatedRows: any) => {
    console.log('Updated Rows:', updatedRows);
  };

  const handleCellClick = (params: any) => {
    console.log('Cell clicked:', params);
  };

  const handleCellEdit = (params: any) => {
    console.log('Cell edited:', params);
  };

  const handleRowAdd = (newRow: any) => {
    console.log('Row added:', newRow);
  };

  const handleRowDelete = (rowId: any) => {
    console.log('Row deleted:', rowId);
  };

  const addRow = () => {
    const newRow = { id: Date.now(), name: '', age: '', date: '' };
    gridRef.current?.addRow(newRow);
  };

  const deleteRow = (rowId: number) => {
    gridRef.current?.deleteRow(rowId);
  };

  return (
    <Box>
      <DataGridBuilder
        ref={gridRef}
        config={gridConfig}
        onSave={handleSave}
        onCellClick={handleCellClick}
        onCellEdit={handleCellEdit}
        onRowAdd={handleRowAdd}
        onRowDelete={handleRowDelete}
      />
      <LoadingButton
        variant="contained"
        color="inherit"
        onClick={addRow}
        sx={{ mt: 2, mr: 1 }}
        size="small"
      >
        Add Row
      </LoadingButton>
      <LoadingButton
        variant="contained"
        color="inherit"
        onClick={() => deleteRow(1)}
        sx={{ mt: 2 }}
        size="small"
      >
        Delete Row with ID 1
      </LoadingButton>
    </Box>
  );
};

export default AccountingGrid;
