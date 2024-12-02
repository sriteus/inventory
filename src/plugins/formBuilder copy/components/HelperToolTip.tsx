import React from 'react';
import { Tooltip, IconButton } from '@mui/material';

interface HelperTooltipProps {
  helperText: string;
}

const HelperTooltip: React.FC<HelperTooltipProps> = ({ helperText }) => (
  <Tooltip title={helperText} arrow placement="top">
    <IconButton
      size="small"
      sx={{
        padding: '4px',
        marginLeft: '4px',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        borderRadius: '50%',
        backgroundColor: '#f9f9f9',
        color: '#555',
        '&:hover': {
          backgroundColor: '#e0e0e0',
        },
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </IconButton>
  </Tooltip>
);

export default HelperTooltip;
