import type { GridRowsProp, GridRowModel } from '@mui/x-data-grid';

import { styled } from '@mui/material/styles';
import { Box, Button, IconButton } from '@mui/material';
import { DataGrid, GridDeleteIcon } from '@mui/x-data-grid';
import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { excelStyle } from './excelStyle';

interface DataGridBuilderProps {
  config: {
    showActionColumn: any;
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

const ExcelLikeGrid = styled(DataGrid)(({ theme }) => excelStyle);

const DataGridBuilder = forwardRef<DataGridBuilderRef, DataGridBuilderProps>(
  ({ config, onSave, onCellClick, onCellEdit, onRowAdd, onRowDelete }, ref) => {
    const { columns, rows } = config;
    const [gridRows, setGridRows] = useState<GridRowsProp>(rows);

    useImperativeHandle(ref, () => ({
      getRowsData: () => gridRows,
      updateRows: (updatedRows: GridRowsProp) => setGridRows(updatedRows),
      addRow: (newRow) => {
        setGridRows((prevRows) => {
          const maxId = prevRows.length > 0 ? Math.max(...prevRows.map((row) => row.id)) : 0;
          const rowWithId = { ...newRow, id: maxId + 1 };
          if (onRowAdd) onRowAdd(rowWithId);
          return [...prevRows, rowWithId];
        });
      },
      deleteRow: (rowId) => {
        setGridRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
        if (onRowDelete) onRowDelete(rowId);
      },
    }));

    const handleDeleteRow = (rowId: number) => {
      setGridRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
      if (onRowDelete) onRowDelete(rowId);
    };

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

    // Define the "Action" column if the config specifies it
    const actionColumn = config.showActionColumn
      ? [
          {
            field: 'action',
            headerName: 'Action',
            width: 80,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
              <IconButton size="small" onClick={() => handleDeleteRow(params.row.id)}>
                <GridDeleteIcon color="error" style={{ height: 20 }} />
              </IconButton>
            ),
          },
        ]
      : [];

    // Combine user-defined columns with optional action column
    const gridColumns: any[] = [
      ...columns.map((col) => ({
        field: col.field,
        headerName: col.headerName,
        type: col.type || 'string',
        editable: col.editable || false,
        width: col.width || 150,
        align: col.align || 'left',
        headerAlign: col.headerAlign || 'left',
      })),
      ...actionColumn,
    ];

    return (
      <Box sx={{ width: '100%' }}>
        <ExcelLikeGrid
          rows={gridRows}
          columns={gridColumns}
          processRowUpdate={processRowUpdate}
          onCellClick={handleCellClick}
          onCellEditStop={handleCellEdit}
          disableColumnMenu
          // hideFooter

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
