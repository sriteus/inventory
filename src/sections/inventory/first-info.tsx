// import React, { useState } from 'react';
// import { LoadingButton } from '@mui/lab';
// import { Box, TextField } from '@mui/material';
// import SecondInfo from './second-info';

// const FirstInfo = () => {
//   const [formData, setFormData] = useState({
//     name: 'Tester',
//     date: '',
//     vehicleNumber: 'Tester-123',
//     totalQuantity: 200,
//   });

//   const [disabled, setDisabled] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     if (!formData.name || !formData.vehicleNumber || formData.totalQuantity <= 0) {
//       alert('Please fill in all required fields.');
//       return;
//     }

//     alert(JSON.stringify(formData, null, 2));
//     setDisabled(true);
//   };

//   const txtStyles = { mb: { xs: 2, md: 0 } }; // Margin for mobile view

//   return (
//     <div>
//       <Box
//         display="flex"
//         flexDirection={{ xs: 'column', md: 'row' }}
//         justifyContent="space-between"
//         gap={{ xs: 1, md: 2 }}
//       >
//         <Box flex={1}>
//           <TextField
//             sx={txtStyles}
//             size="small"
//             fullWidth
//             label="Name"
//             variant="outlined"
//             required
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             disabled={disabled}
//           />
//         </Box>
//         <Box flex={1}>
//           <TextField
//             sx={txtStyles}
//             size="small"
//             fullWidth
//             type="date"
//             label="Date"
//             variant="outlined"
//             InputLabelProps={{ shrink: true }}
//             required
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             disabled={disabled}
//           />
//         </Box>
//         <Box flex={1}>
//           <TextField
//             sx={txtStyles}
//             size="small"
//             fullWidth
//             label="Vehicle Number (Indian)"
//             variant="outlined"
//             required
//             name="vehicleNumber"
//             value={formData.vehicleNumber}
//             onChange={handleChange}
//             disabled={disabled}
//           />
//         </Box>
//         <Box flex={1}>
//           <TextField
//             sx={txtStyles}
//             size="small"
//             fullWidth
//             label="Total Quantity"
//             variant="outlined"
//             type="number"
//             required
//             name="totalQuantity"
//             value={formData.totalQuantity}
//             onChange={handleChange}
//             disabled={disabled}
//           />
//         </Box>
//         <Box flex={1}>
//           <LoadingButton
//             fullWidth
//             variant="contained"
//             color="inherit"
//             onClick={handleSubmit}
//             disabled={disabled}
//           >
//             Submit
//           </LoadingButton>
//         </Box>
//       </Box>
//       {disabled && <SecondInfo stockLoader={formData} />}
//     </div>
//   );
// };

// export default FirstInfo;
