import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

// Desktop Version with Open/Close Toggle Button
export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false); // State to manage open/close

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 1.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: isExpanded ? 'var(--layout-nav-vertical-width)' : 75,
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.12
        )})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        transition: 'width 0.3s ease',
        ...sx,
      }}
    >
      <IconButton
        onClick={() => setIsExpanded((prev) => !prev)}
        sx={{
          alignSelf: isExpanded ? 'flex-end' : 'center',
          mb: 2,
        }}
      >
        {isExpanded ? <FaTimes /> : <FaBars />}
      </IconButton>

      <NavContent data={data} slots={slots} isExpanded={isExpanded} />
    </Box>
  );
}

// Mobile Version
export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} isExpanded />
    </Drawer>
  );
}

// NavContent Component with isExpanded prop for Desktop
export function NavContent({
  data,
  slots,
  sx,
  isExpanded = false, // Default to false for desktop
}: NavContentProps & { isExpanded?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {/* <Logo sx={{ mb: 5 }} /> */}

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: '#D0F0C0',
                        color: 'green',
                        '&:hover': {
                          bgcolor: '#D0F0C0',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 20, height: 20 }}>
                      {item.icon}
                    </Box>

                    {isExpanded && (
                      <Box component="span" flexGrow={1}>
                        {item.title}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
