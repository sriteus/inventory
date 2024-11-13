// import type { GridColDef } from '@mui/x-data-grid';

// import React, { useState, useEffect } from 'react';

// import Box from '@mui/material/Box';
// import { LoadingButton } from '@mui/lab';
// import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

// import ChildGrid from './third-info';

// const columns: GridColDef[] = [
//   {
//     field: 'itemname',
//     headerName: 'Item Name',
//     width: 200,
//     editable: true,
//     type: 'string',
//     headerAlign: 'center',
//   },
//   {
//     field: 'qualitygrade',
//     align: 'center',
//     headerAlign: 'center',
//     headerName: 'Quality Grade',
//     width: 150,
//     editable: true,
//     type: 'singleSelect',
//     valueOptions: ['Good', 'Average', 'Bad'],
//   },
//   {
//     field: 'quantity',
//     headerName: 'Quantity',
//     type: 'number',
//     width: 100,
//     editable: true,
//     headerAlign: 'center',
//   },
// ];

// interface SecondInfoProps {
//   stockLoader: {
//     name: string;
//     date: string;
//     vehicleNumber: string;
//     totalQuantity: number;
//   };
// }

// interface ChildData {
//   size: string;
//   quantity: number;
//   price: number;
// }

// const DataGridFooter = ({
//   quantityLeft,
//   totalQuantity,
//   totalColor,
// }: {
//   quantityLeft: number;
//   totalQuantity: number;
//   totalColor: string;
// }) => (
//   <div>
//     <hr />
//     <Box display="flex" justifyContent="space-between" margin={1} mt={1} mb={1}>
//       <Box flex={1} mr={1} sx={{ color: totalColor }}>
//         Quantity Left: {quantityLeft < 0 ? 0 : quantityLeft}
//       </Box>
//       <Box mr={1} sx={{ color: totalColor }}>
//         Total To Match: {totalQuantity}
//       </Box>
//     </Box>
//   </div>
// );

// const SecondInfo: React.FC<SecondInfoProps> = ({ stockLoader }) => {
//   const [rows, setRows] = useState([{ id: 1, itemname: '', qualitygrade: '', quantity: 0 }]);
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const [quantityLeft, setQuantityLeft] = useState(stockLoader.totalQuantity);
//   const [totalColor, setTotalColor] = useState('black');
//   const [selectedItem, setSelectedItem] = useState<{ itemname: string; quantity: number } | null>(
//     null
//   );
//   const [parentChildData, setParentChildData] = useState<Record<string, ChildData[]>>({});

//   const isRowFilled = (row: any) =>
//     row.itemname !== '' && row.qualitygrade !== '' && row.quantity > 0;

//   const handleRowEdit = (newRow: any) => {
//     const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
//     const newTotalQuantity = updatedRows.reduce((sum, row) => sum + row.quantity, 0);
//     const newQuantityLeft = stockLoader.totalQuantity - newTotalQuantity;

//     const newRowIndex = updatedRows.findIndex((row) => row.id === newRow.id);
//     const canAddNewRow = newRowIndex === 0 || updatedRows[newRowIndex - 1].quantity > 0;

//     if (isRowFilled(newRow) && newQuantityLeft > 0 && canAddNewRow) {
//       updatedRows.push({ id: rows.length + 1, itemname: '', qualitygrade: '', quantity: 0 });
//     }

//     const seenItems = new Set();
//     const filteredRows = updatedRows.filter((row) => {
//       if (row.quantity === 0 && seenItems.has(row.itemname)) return false;
//       seenItems.add(row.itemname);
//       return true;
//     });

//     setRows(filteredRows);
//     setTotalQuantity(newTotalQuantity);
//     setQuantityLeft(newQuantityLeft);
//     return newRow;
//   };

//   const handleRowClick = (params: any) => {
//     if (isRowFilled(params.row)) {
//       setSelectedItem(params.row);
//     }
//   };

//   const handleSaveChildData = (itemname: string, childRows: ChildData[]) => {
//     setParentChildData((prevData) => ({
//       ...prevData,
//       [itemname]: childRows,
//     }));
//   };

//   useEffect(() => {
//     if (quantityLeft > 0) {
//       setTotalColor('green');
//     } else if (quantityLeft < 0) {
//       setTotalColor('red');
//       alert('Quantity Exceeded. Please match the total quantity');
//     } else {
//       setTotalColor('black');
//     }
//   }, [quantityLeft]);
//   const dataGridStyles = {
//     border: '1px solid #E0E0E0',
//     '& .MuiDataGrid-row': {
//       backgroundColor: quantityLeft === 0 ? '#DCDCDC' : 'silver',
//       borderBottom: '1px solid #E0E0E0',
//       '&:hover': {
//         backgroundColor: '#D3D3D3',
//       },
//     },
//     '& .MuiTablePagination-displayedRows': {
//       marginTop: '14px',
//     },
//     '& .MuiDataGrid-columnHeader': {
//       backgroundColor: 'black',
//       color: 'white',
//       fontSize: '12px',
//       display: 'flex',
//       justifyContent: 'center',
//     },
//     '& .MuiDataGrid-row.Mui-selected': {
//       backgroundColor: 'white',
//       fontWeight: 'bold',
//       '&:hover': {
//         backgroundColor: 'white',
//       },
//     },
//     '& .MuiDataGrid-footerContainer': {
//       height: '40px',
//       minHeight: '40px',
//     },
//   };
//   // eslint-disable-next-line react/no-unstable-nested-components
//   function CustomToolbar() {
//     return (
//       <GridToolbarContainer>
//         <LoadingButton>Test Custom Button </LoadingButton>
//         <GridToolbarExport />
//       </GridToolbarContainer>
//     );
//   }
//   return (
//     <div>
//       <Box
//         sx={{
//           width: '100%',
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           gap: { xs: 5, md: 10 },
//         }}
//       >
//         <Box sx={{ height: 300, width: '100%', maxWidth: 451.8, mt: 0 }}>
//           <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Master Inventory</p>
//           <DataGrid
//             sx={dataGridStyles}
//             editMode="row"
//             columnHeaderHeight={25}
//             rowHeight={25}
//             rows={rows}
//             columns={columns}
//             processRowUpdate={handleRowEdit}
//             onRowClick={handleRowClick}
//             slots={{
//               footer: () => (
//                 <DataGridFooter
//                   quantityLeft={quantityLeft}
//                   totalQuantity={totalQuantity}
//                   totalColor={totalColor}
//                 />
//               ),
//               toolbar: CustomToolbar,
//             }}
//           />
//         </Box>
//         {selectedItem && quantityLeft === 0 && (
//           <ChildGrid
//             itemname={selectedItem?.itemname}
//             maxQuantity={selectedItem?.quantity}
//             onSave={handleSaveChildData}
//             initialData={parentChildData[selectedItem.itemname]}
//           />
//         )}
//       </Box>
//       <div style={{ marginTop: '80px' }}>
//         <h3>Current Parent-Child Data:</h3>
//         <pre>{JSON.stringify({ stockLoader, parentChildData }, null, 2)}</pre>
//       </div>
//     </div>
//   );
// };

// export default SecondInfo;
