// import { HotTable } from '@handsontable/react';
// import React, { useState, useEffect } from 'react';

// import Box from '@mui/material/Box';

// interface ThirdInfoProps {
//   selected: {
//     id: number;
//     itemname: string;
//     quality: string;
//     quantity: number;
//   };
// }

// const ThirdInfo: React.FC<ThirdInfoProps> = ({ selected }) => {
//   const [data, setData] = useState([{ id: 1, size: '', price: 0, quantity: 0 }]);
//   const [totalQuantity, setTotalQuantity] = useState(0);

//   useEffect(() => {
//     // Calculate total quantity whenever data changes
//     const calculateTotalQuantity = () => {
//       const total = data.reduce((sum, row) => sum + (row.quantity || 0), 0);
//       setTotalQuantity(total);
//     };
//     calculateTotalQuantity();
//   }, [data]);

//   const addRow = () => {
//     const currentTotal = data.reduce((sum, row) => sum + (row.quantity || 0), 0);
//     if (currentTotal < selected.quantity) {
//       setData((prevData) => [
//         ...prevData,
//         { id: prevData.length + 1, size: '', price: 0, quantity: 0 },
//       ]);
//     } else {
//       alert('Max Quantity Reached for item details');
//     }
//   };

//   const customValidator = (value: any, callback: any) => {
//     callback(value >= 0);
//   };

//   return (
//     <Box>
//       <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{selected.itemname}</p>
//       <div>Quality: {selected.quality}</div>
//       <div>Quantity: {selected.quantity}</div>

//       <HotTable
//         data={data}
//         dataSchema={{
//           id: null,
//           size: null,
//           price: null,
//           quantity: null,
//         }}
//         startRows={5}
//         colHeaders={['ID', 'Size', 'Price', 'Quantity']}
//         height="auto"
//         autoWrapRow
//         autoWrapCol
//         width="auto"
//         columns={[
//           { data: 'id', type: 'numeric', readOnly: true },
//           { data: 'size' },
//           { data: 'price', type: 'numeric', validator: customValidator },
//           { data: 'quantity', type: 'numeric', validator: customValidator },
//         ]}
//         minSpareRows={0}
//         colWidths={[50, 100, 100, 100]}
//         licenseKey="non-commercial-and-evaluation"
//         afterChange={(changes) => {
//           if (changes) {
//             setData((prevData) => {
//               // Filter out empty rows to keep only filled ones
//               const filteredData = prevData.filter((row) => row.size || row.quantity);

//               // Return the updated data set
//               return filteredData.length ? filteredData : prevData;
//             });

//             // Add a new row if last row is fully filled and doesn't exceed total quantity
//             const lastRow = data[data.length - 1];
//             if (lastRow && lastRow.size && lastRow.price && lastRow.quantity) {
//               addRow();
//             }
//           }
//         }}
//       />
//       <Box sx={{ textAlign: 'right', fontWeight: 'bold', marginTop: 2 }}>
//         Total Quantity in Details: {totalQuantity}/{selected.quantity}
//       </Box>
//     </Box>
//   );
// };

// export default ThirdInfo;
