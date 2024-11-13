// import React from 'react';
// import { TextField } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { Dayjs } from 'dayjs';
// interface DatePickerProps {
//   label: string;
//   name: string;
//   required?: boolean;
//   fullWidth?: boolean;
//   style?: React.CSSProperties;
// }

// const CustomDatePicker: React.FC<DatePickerProps> = ({
//   label,
//   name,
//   required,
//   fullWidth,
//   style,
// }) => {
//   const [value, setValue] = React.useState<Dayjs | null>(null);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DatePicker
//         label={label}
//         value={value}
//         onChange={(newValue) => setValue(newValue)}
//         renderInput={(params) => (
//           <TextField {...params} name={name} required={required} fullWidth={fullWidth} style={style} />
//         )}
//       />
//     </LocalizationProvider>
//   );
// };

// export default CustomDatePicker;
