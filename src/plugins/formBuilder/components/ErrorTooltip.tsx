import React from 'react';
import { FormHelperText, Tooltip } from '@mui/material';

interface ErrorTooltipProps {
  error: string | null;
}

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({ error }) => {
  return (
    <Tooltip title={error || ''} disableHoverListener={!error} arrow>
      <FormHelperText
        sx={{
          margin: '0px',
          fontSize: '10px',
          minHeight: '16px', // Reserve space for error text
          visibility: error ? 'visible' : 'hidden', // Only show when there's an error
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {error}
      </FormHelperText>
    </Tooltip>
  );
};

export default ErrorTooltip;
