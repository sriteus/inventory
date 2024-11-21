import type { GridColDef, GridRowsProp, GridRowModel } from '@mui/x-data-grid';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
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
}

export interface DataGridBuilderRef {
  getRowsData: () => GridRowsProp;
  updateRows: (rows: GridRowsProp) => void;
}

const ExcelLikeGrid = styled(DataGrid)(({ theme }) => ({
  border: '1px solid #E0E0E0',
  backgroundColor: 'white',
  '& .MuiDataGrid-cell': {
    padding: '0px 8px',
    borderRight: '1px solid #E0E0E0',
    borderBottom: '1px solid #E0E0E0',
    fontSize: '14px',
    lineHeight: '22px !important',
    height: '22px !important',
    minHeight: '22px !important',
    maxHeight: '22px !important',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: 'flex !important',
    alignItems: 'center !important',
    '&:focus': {
      outline: 'none',
    },
    '&:focus-within': {
      outline: '2px solid #1976d2',
      outlineOffset: '-2px',
    },
    '& > div': {
      maxHeight: '22px !important',
      lineHeight: '22px !important',
    },
  },
  '& .MuiDataGrid-row': {
    maxHeight: '22px !important',
    minHeight: '22px !important',
  },
  '& .MuiDataGrid-columnHeader': {
    padding: '0px 8px',
    height: '24px !important',
    minHeight: '24px !important',
    maxHeight: '24px !important',
    backgroundColor: '#F5F5F5',
    borderRight: '1px solid #E0E0E0',
    borderBottom: '1px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    '&:focus': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-columnHeaders': {
    height: '24px !important',
    minHeight: '24px !important',
    maxHeight: '24px !important',
    lineHeight: '24px !important',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: '14px',
    fontWeight: 'bold',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: '24px',
  },
  '& .MuiDataGrid-cell--selected': {
    outline: 'none !important',
  },
  '& .MuiDataGrid-editInputCell': {
    padding: '0px 8px',
    height: '22px',
    fontSize: '14px',
    lineHeight: '22px',
  },
  '& .MuiDataGrid-cellContent': {
    lineHeight: '22px !important',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const DataGridBuilder = forwardRef<DataGridBuilderRef, DataGridBuilderProps>(
  ({ config, onSave }, ref) => {
    const { columns, rows } = config;
    const [gridRows, setGridRows] = useState<GridRowsProp>(() =>
      rows.map((row) => {
        const newRow = { ...row };
        columns.forEach((col) => {
          if (col.type === 'date' && row[col.field]) {
            newRow[col.field] = new Date(row[col.field]);
          }
        });
        return newRow;
      })
    );

    const apiRef = useGridApiRef();

    useImperativeHandle(ref, () => ({
      getRowsData: () => gridRows,
      updateRows: (updatedRows: GridRowsProp) => {
        const processedRows = updatedRows.map((row) => {
          const newRow = { ...row };
          columns.forEach((col) => {
            if (col.type === 'date' && row[col.field]) {
              newRow[col.field] = new Date(row[col.field]);
            }
          });
          return newRow;
        });
        setGridRows(processedRows);
      },
    }));

    const processRowUpdate = (newRow: GridRowModel) => {
      const updatedRow = { ...newRow };
      columns.forEach((col) => {
        if (col.type === 'date' && newRow[col.field]) {
          updatedRow[col.field] = new Date(newRow[col.field]);
        }
      });

      setGridRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)));

      return updatedRow;
    };

    const handleSave = () => {
      console.log('Saving rows:', gridRows);
      if (onSave) onSave(gridRows);
    };

    const gridColumns: GridColDef[] = columns.map((col) => ({
      field: col.field,
      headerName: col.headerName,
      type: col.type || 'string',
      editable: col.editable || false,
      width: col.width || 150,
      sortable: false,
    }));

    return (
      <Box sx={{ width: '100%', '& .MuiButton-root': { mt: 1 } }}>
        <ExcelLikeGrid
          rows={gridRows}
          columns={gridColumns}
          disableRowSelectionOnClick
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('Error while saving:', error);
          }}
          apiRef={apiRef}
          disableColumnMenu
          hideFooter
          density="compact"
        />
        <Button variant="contained" color="primary" onClick={handleSave} size="small">
          Save Changes
        </Button>
      </Box>
    );
  }
);

export default DataGridBuilder;
