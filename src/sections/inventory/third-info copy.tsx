// /* eslint-disable react-hooks/exhaustive-deps */
// import type { GridColDef } from '@mui/x-data-grid';

// import React, { useState, useEffect } from 'react';

// import Box from '@mui/material/Box';
// import { LoadingButton } from '@mui/lab';
// import { DataGrid } from '@mui/x-data-grid';

// interface ChildGridProps {
//   itemname: string;
//   maxQuantity: number;
//   initialData?: { size: string; quantity: number; price: number }[];
//   onSave: (
//     itemname: string,
//     childRows: { size: string; quantity: number; price: number }[]
//   ) => void;
// }

// const columns: GridColDef[] = [
//   {
//     field: 'size',
//     headerName: 'Size',
//     width: 200,
//     editable: true,
//     headerAlign: 'center',
//     type: 'singleSelect',
//     valueOptions: ['Small', 'Medium', 'Large', 'Extra Large'],
//   },
//   {
//     field: 'price',
//     headerName: 'Price',
//     width: 150,
//     editable: true,
//     type: 'number',
//     headerAlign: 'center',
//   },
//   {
//     field: 'quantity',
//     headerName: 'Quantity',
//     width: 100,
//     editable: true,
//     type: 'number',
//     headerAlign: 'center',
//   },
// ];

// const DataGridFooter = ({
//   quantityLeft,
//   totalColor,
//   handleSave,
// }: {
//   quantityLeft: number;
//   totalColor: string;
//   handleSave: () => void;
// }) => (
//   <div>
//     <hr />
//     <Box display="flex" justifyContent="space-between" margin={1} mt={1} mb={1}>
//       <Box flex={1} mr={1} sx={{ color: totalColor }}>
//         Quantity Left: {quantityLeft < 0 ? 0 : quantityLeft}
//       </Box>
//       <Box>
//         {quantityLeft === 0 && (
//           <LoadingButton
//             variant="contained"
//             sx={{ height: '23px' }}
//             color="inherit"
//             onClick={handleSave}
//           >
//             Save
//           </LoadingButton>
//         )}
//       </Box>
//     </Box>
//   </div>
// );

// const ChildGrid: React.FC<ChildGridProps> = ({ itemname, maxQuantity, initialData, onSave }) => {
//   const [rows, setRows] = useState([{ id: 1, size: '', quantity: 0, price: 0 }]);
//   const [quantityLeft, setQuantityLeft] = useState(maxQuantity);
//   const [totalColor, setTotalColor] = useState('black');

//   const updateQuantityLeft = (updatedRows: typeof rows) => {
//     const totalQuantity = updatedRows.reduce((sum, row) => sum + row.quantity, 0);
//     setQuantityLeft(maxQuantity - totalQuantity);
//   };

//   const handleRowEdit = (newRow: (typeof rows)[number]) => {
//     const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
//     updateQuantityLeft(updatedRows);

//     const newRowIndex = updatedRows.findIndex((row) => row.id === newRow.id);
//     const canAddNewRow = newRowIndex === 0 || updatedRows[newRowIndex - 1].quantity > 0;

//     if (
//       newRow.size &&
//       newRow.quantity > 0 &&
//       newRow.price > 0 &&
//       quantityLeft > 0 &&
//       canAddNewRow
//     ) {
//       updatedRows.push({ id: rows.length + 1, size: '', quantity: 0, price: 0 });
//     }

//     const seenSizes = new Set();
//     const filteredRows = updatedRows.filter((row) => {
//       if (row.quantity === 0) {
//         if (seenSizes.has(row.size)) return false;
//         seenSizes.add(row.size);
//       }
//       return true;
//     });

//     setRows(filteredRows);
//     return newRow;
//   };

//   const handleSave = () => {
//     const filteredRows = rows.filter((row) => row.quantity > 0);
//     onSave(itemname, filteredRows);
//   };

//   useEffect(() => {
//     setQuantityLeft(maxQuantity);

//     if (initialData && initialData.length > 0) {
//       const loadedRows = initialData.map((data, index) => ({
//         id: index + 1,
//         ...data,
//       }));
//       setRows(loadedRows);
//       updateQuantityLeft(loadedRows);
//     } else {
//       setRows([{ id: 1, size: '', quantity: 0, price: 0 }]);
//     }
//   }, [initialData, maxQuantity, itemname]);

//   useEffect(() => {
//     setTotalColor(quantityLeft > 0 ? 'green' : quantityLeft < 0 ? 'red' : 'black');
//     if (quantityLeft < 0) alert('Quantity exceeded for the selected item');
//   }, [quantityLeft]);

//   return (
//     <Box sx={{ height: 300, width: '100%', maxWidth: 451.8, mt: 0 }}>
//       <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Sub Inventory: {itemname}</p>
//       <DataGrid
//         sx={{
//           border: '1px solid #E0E0E0',
//           '& .MuiDataGrid-row': {
//             backgroundColor: quantityLeft === 0 ? '#DCDCDC' : '#F5F5F5',
//             borderBottom: '1px solid #E0E0E0',
//             '&:hover': { backgroundColor: '#D3D3D3' },
//           },
//           '& .MuiTablePagination-displayedRows': { marginTop: '14px' },
//           '& .MuiDataGrid-columnHeader': {
//             backgroundColor: 'black',
//             color: 'white',
//             fontSize: '12px',
//             display: 'flex',
//             justifyContent: 'center',
//           },
//           '& .MuiDataGrid-footerContainer': { height: '40px', minHeight: '40px' },
//           '& .MuiDataGrid-row.Mui-selected': {
//             backgroundColor: 'white',
//             fontWeight: 'bold',
//             '&:hover': { backgroundColor: 'white' },
//           },
//         }}
//         columnHeaderHeight={25}
//         rowHeight={25}
//         rows={rows}
//         columns={columns}
//         processRowUpdate={handleRowEdit}
//         disableRowSelectionOnClick
//         slots={{
//           footer: () => (
//             <DataGridFooter
//               quantityLeft={quantityLeft}
//               totalColor={totalColor}
//               handleSave={handleSave}
//             />
//           ),
//         }}
//       />
//     </Box>
//   );
// };

// export default ChildGrid;
