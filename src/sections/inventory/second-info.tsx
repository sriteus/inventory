// import 'handsontable/dist/handsontable.full.min.css';

// import { HyperFormula } from 'hyperformula';
// import { HotTable } from '@handsontable/react';
// import React, { useState, useEffect } from 'react';
// import { registerAllModules } from 'handsontable/registry';

// import Box from '@mui/material/Box';
// import { LoadingButton } from '@mui/lab';

// import ThirdInfo from './third-info';

// registerAllModules();

// interface SecondInfoProps {
//   stockLoader: {
//     name: string;
//     date: string;
//     vehicleNumber: string;
//     totalQuantity: number;
//   };
// }

// const SecondInfo: React.FC<SecondInfoProps> = ({ stockLoader }) => {
//   const initialData = [{ id: 1, itemname: '', quality: '', quantity: 0 }];

//   const [data, setData] = useState(initialData);
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const [preview, setPreview] = useState({ id: 1, itemname: '', quality: '', quantity: 0 });

//   useEffect(() => {
//     const calculateTotalQuantity = () => {
//       const total = data.reduce((sum, row) => sum + (row.quantity || 0), 0);
//       setTotalQuantity(total);
//     };
//     calculateTotalQuantity();
//   }, [data]);

//   const saveData = () => {
//     if (totalQuantity !== stockLoader.totalQuantity) {
//       alert('Total Quantity does not match');
//       return;
//     }
//     console.log(data.filter((row) => row.quantity !== null && row.quantity !== 0));
//   };

//   const customValidator = (query: any, callback: any) => {
//     callback(query >= 10);
//   };

//   const addRow = () => {
//     const lastRow = data[data.length - 1];
//     if (!lastRow.quantity) return;

//     const currentTotal = data.reduce((sum, row) => sum + (row.quantity || 0), 0);
//     if (currentTotal < stockLoader.totalQuantity) {
//       setData((prevData) => [
//         ...prevData,
//         { id: prevData.length + 1, itemname: '', quality: '', quantity: 0 },
//       ]);
//     } else {
//       alert('Max Quantity Reached');
//     }
//   };
//   const handleAfterSelection = (row: any) => {
//     // Access the selected row's data
//     const selectedRowData = data[row];
//     if (selectedRowData !== undefined) {
//       setPreview(selectedRowData);
//     }

//     // You can update state or trigger other actions with selectedRowData
//   };
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
//         <Box sx={{ height: 300, width: '100%', maxWidth: 350, mt: 0 }}>
//           <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Master Inventory</p>
//           <HotTable
//             data={data}
//             // dataSchema={{
//             //   id: null,
//             //   itemname: null,
//             //   quality: null,
//             //   quantity: null,
//             // }}
//             startRows={15}
//             startCols={4}
//             autoWrapRow
//             autoWrapCol
//             allowInvalid={false}
//             colHeaders={['ID', 'Item Name', 'Quality', 'Quantity']}
//             height="auto"
//             width="auto"
//             columns={[
//               { data: 'id', type: 'numeric', readOnly: true },
//               { data: 'itemname' },
//               { data: 'quality', type: 'dropdown', source: ['Good', 'Average', 'Bad'] },
//               { data: 'quantity', type: 'numeric', validator: customValidator },
//             ]}
//             formulas={{
//               engine: HyperFormula,
//             }}
//             // columnSummary={[
//             //   {
//             //     sourceColumn: 3,
//             //     type: 'sum',
//             //     // destinationRow: 3,
//             //     // destinationColumn: 3,
//             //     // force this column summary to treat non-numeric values as numeric values
//             //     forceNumeric: true,
//             //     reversedRowCoords: true,
//             //     // now, to always display this column summary in the bottom row,
//             //     // set `destinationRow` to `0` (i.e. the last possible row)
//             //     destinationRow: 0,
//             //     destinationColumn: 3,
//             //   },
//             // ]}
//             minSpareRows={0}
//             colWidths={[50, 100, 100, 100]}
//             licenseKey="non-commercial-and-evaluation"
//             // afterDocumentKeyDown={addRow}
//             afterChange={(changes) => {
//               if (changes) {
//                 setData((prevData) => {
//                   // Prevents removing a row that is in the process of being filled
//                   const filteredData = prevData.filter((row) => row.itemname || row.quantity);

//                   // Return the updated data set
//                   return filteredData.length ? filteredData : prevData;
//                 });

//                 const lastRow = data[data.length - 1];
//                 if (lastRow && lastRow.quantity && lastRow.itemname && lastRow.quality) {
//                   addRow();
//                 }
//               }
//             }}
//             afterSelection={handleAfterSelection}
//           />
//           <LoadingButton onClick={saveData}>Save</LoadingButton>
//           <LoadingButton onClick={addRow}>Add Row</LoadingButton>
//           <Box sx={{ textAlign: 'right', fontWeight: 'bold', marginTop: 2 }}>
//             Total Quantity: {totalQuantity}
//           </Box>
//         </Box>
//         <Box sx={{ height: 300, width: '100%', maxWidth: 350, mt: 2 }}>
//           {totalQuantity === stockLoader.totalQuantity && <ThirdInfo selected={preview} />}
//         </Box>
//       </Box>
//       <pre>{JSON.stringify(preview, null, 2)}</pre>
//     </div>
//   );
// };

// export default SecondInfo;
