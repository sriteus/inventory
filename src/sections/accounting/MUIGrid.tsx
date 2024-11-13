import type { GridColDef } from '@mui/x-data-grid';

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { DashboardContent } from 'src/layouts/dashboard';

// Define the columns for the DataGrid
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Item Name', width: 150, editable: true },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 110, editable: true },
  {
    field: 'quality',
    headerName: 'Quality',
    width: 150,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Good', 'Medium', 'Bad'],
  },

  { field: 'price', headerName: 'Price', type: 'number', width: 110, editable: true },
];

export default function InventoryDataGrid() {
  const [rows, setRows] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, quality: '', price: 0 });

  // Fetch inventory items from the backend API
  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/inventory');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  useEffect(() => {
    fetchInventoryItems(); // Call the fetch function when the component mounts
  }, []);

  // Handle row update
  const handleRowEdit = async (newRow: any) => {
    const { id, name, quantity, quality, price } = newRow;
    const updatePayload = { name, quantity, quality, price };

    try {
      const response = await axios.put(`http://localhost:3000/api/inventory/${id}`, updatePayload);
      alert('Row updated');
      // Update the state with the updated row
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, ...response.data } : row))
      );
      return response.data; // Return the updated row
    } catch (error) {
      alert('Row updated failed');
      console.error('Error updating inventory item:', error);
      throw error; // Propagate error if needed
    }
  };

  // Handle adding a new item
  const handleAddItem = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/inventory', newItem);
      setRows((prevRows) => [...prevRows, response.data]);
      setNewItem({ name: '', quantity: 0, quality: '', price: 0 });
    } catch (error) {
      console.error('Error creating inventory item:', error);
    }
  };

  // Handle deletion of selected items
  const handleDeleteItems = async (selectedIds: number[]) => {
    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`http://localhost:3000/api/inventory/${id}`))
      );
      // Filter out deleted items from the state
      setRows((prevRows) => prevRows.filter((row) => !selectedIds.includes(row.id)));
    } catch (error) {
      console.error('Error deleting inventory items:', error);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ marginBottom: 2, padding: '5px' }}>
        <TextField
          label="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          sx={{ marginRight: 1 }}
        />
        <TextField
          label="Quantity"
          type="number"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          sx={{ marginRight: 1 }}
        />
        <TextField
          label="Quality"
          variant="outlined"
          select
          value={newItem.quality}
          onChange={(e) => setNewItem({ ...newItem, quality: e.target.value })}
          sx={{ marginRight: 1, minWidth: '200px' }} // Set a minimum width for the input
        >
          <option value="Good">Good</option>
          <option value="Medium">Medium</option>
          <option value="Bad">Bad</option>
        </TextField>
        <TextField
          label="Price"
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
          sx={{ marginRight: 1 }}
        />
        <Button variant="contained" onClick={handleAddItem}>
          Add Item
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            const selectedIds = rows.filter((row) => row.isSelected).map((row) => row.id);
            handleDeleteItems(selectedIds);
          }}
          sx={{ marginLeft: 1 }}
        >
          Delete Selected
        </Button>
      </Box>
      <DataGrid
        sx={{
          border: '1px solid #E0E0E0',
          height: '100%',
          maxHeight: '300px',
          width: '100%',
          // maxWidth: '660px',
          '& .MuiDataGrid-row': {
            backgroundColor: '#F5F5F5',
            borderBottom: '1px solid #E0E0E0',
            '&:hover': {
              backgroundColor: '#D3D3D3', // Change hover color
            },
          },
          '& .MuiDataGrid-footerContainer': {
            height: 2,
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#989898',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'white',
          },
        }}
        columnHeaderHeight={25}
        rowHeight={25}
        rows={rows}
        columns={columns}
        processRowUpdate={handleRowEdit}
        checkboxSelection
        loading={rows.length === 0}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'skeleton',
          },
        }}
        disableRowSelectionOnClick
        rowSelectionModel={rows.filter((row) => row.isSelected).map((row) => row.id)}
        onRowSelectionModelChange={(newSelection) => {
          const selectedIDs = newSelection;
          setRows((prevRows) =>
            prevRows.map((row) =>
              selectedIDs.includes(row.id)
                ? { ...row, isSelected: true }
                : { ...row, isSelected: false }
            )
          );
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15, 20]}
      />
    </DashboardContent>
  );
}
