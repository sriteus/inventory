import type { SnackbarCloseReason } from '@mui/material/Snackbar';

import * as React from 'react';

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

interface SimpleSnackbarProps {
  opens?: boolean;
  messages?: string;
}
export default function SimpleSnackbar({ opens, messages }: SimpleSnackbarProps) {
  const [open, setOpen] = React.useState(opens);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={messages} />
    </div>
  );
}
