import React, { useState, forwardRef, useImperativeHandle } from 'react';
import type { GridColDef, GridRowsProp, GridRowModel } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

interface ColumnConfig {
  field: string;
  headerName: string;
  type?: 'string' | 'number' | 'boolean';
  editable?: boolean;
  width?: number;
  required?: boolean;
}

interface DataGridBuilderProps {
  config: {
    columns: any[];
    rows: GridRowsProp;
  };
  onSave?: (updatedRows: GridRowsProp) => void;
  onCellClick?: (params: any) => void;
  onCellEdit?: (params: any) => void;
  onRowAdd?: (newRow: any) => void;
  onRowDelete?: (rowId: any) => void;
}

export interface DataGridBuilderRef {
  getRowsData: () => GridRowsProp;
  updateRows: (rows: GridRowsProp) => void;
  addRow: (newRow: any) => void;
  deleteRow: (rowId: any) => void;
}

const ExcelLikeGrid = styled(DataGrid)(({ theme }) => ({
  border: '1px solid #E0E0E0',
  backgroundColor: 'white',
  '& .MuiDataGrid-cell': {
    padding: '0px 8px',
    borderRight: '1px solid #E0E0E0',
    borderBottom: '1px solid #E0E0E0',
  },
  '& .MuiDataGrid-row': {
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
  },
}));

const DataGridBuilder = forwardRef<DataGridBuilderRef, DataGridBuilderProps>(
  ({ config, onSave, onCellClick, onCellEdit, onRowAdd, onRowDelete }, ref) => {
    const { columns, rows } = config;
    const [gridRows, setGridRows] = useState<GridRowsProp>(rows);
    const apiRef = useGridApiRef();

    useImperativeHandle(ref, () => ({
      getRowsData: () => gridRows,
      updateRows: (updatedRows: GridRowsProp) => setGridRows(updatedRows),
      addRow: (newRow) => {
        setGridRows((prevRows) => [...prevRows, newRow]);
        if (onRowAdd) onRowAdd(newRow);
      },
      deleteRow: (rowId) => {
        setGridRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
        if (onRowDelete) onRowDelete(rowId);
      },
    }));

    const processRowUpdate = (newRow: GridRowModel) => {
      setGridRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? newRow : row)));
      return newRow;
    };

    const handleCellClick = (params: any) => {
      if (onCellClick) onCellClick(params);
    };

    const handleCellEdit = (params: any) => {
      if (onCellEdit) onCellEdit(params);
    };

    const handleSave = () => {
      if (onSave) onSave(gridRows);
    };

    const gridColumns: GridColDef[] = columns.map((col) => ({
      field: col.field,
      headerName: col.headerName,
      type: col.type || 'string',
      editable: col.editable || false,
      width: col.width || 150,
    }));

    return (
      <Box sx={{ width: '100%' }}>
        <ExcelLikeGrid
          rows={gridRows}
          columns={gridColumns}
          apiRef={apiRef}
          processRowUpdate={processRowUpdate}
          onCellClick={handleCellClick}
          onCellEditStop={handleCellEdit}
          disableColumnMenu
          hideFooter
          density="compact"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size="small"
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    );
  }
);

export default DataGridBuilder;
