import React from 'react';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import { Stack } from '@mui/material';
import Iconify from "src/components/iconify/Iconify";

const MoveFileTopMenu = ({ selectedFiles, handleMoveSelectedFiles, handleCancelSelection, t }) => {
  return (
    <Stack justifyContent="space-between" mb={5}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {selectedFiles.length > 0 && (
          <>
            <Button
              onClick={handleMoveSelectedFiles}
              variant="contained"
              startIcon={<Iconify icon="eva:move-fill" />}
              style={{ marginRight: '10px' }} // Add right margin to create space
            >
              {t('Move Selected')}
            </Button>
            <Button
              onClick={handleCancelSelection}
              variant="contained"
              startIcon={<CancelIcon />}
              style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }} // Add left margin and red background color
            >
              {t('Cancel')}
            </Button>
          </>
        )}
      </div>
    </Stack>
  );
};

export default MoveFileTopMenu;
