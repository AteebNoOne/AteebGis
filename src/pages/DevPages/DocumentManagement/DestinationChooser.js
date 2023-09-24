import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import API_BASE_URL from './apiConfig';
import { useTranslation } from 'react-i18next';

const DestinationChooser = ({ open, onClose, directories, onMoveConfirm }) => {
  const {t} = useTranslation();
  const [selectedDirectory, setSelectedDirectory] = useState('');
  const [selectedSubdirectory, setSelectedSubdirectory] = useState('');
  const [subdirectories, setSubdirectories] = useState([]);

  const getSubDirectories = async (directory) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subdirectories?directoryname=${directory}`
      );
      setSubdirectories(response.data);
    } catch (error) {
      // Handle the error here if needed
    }
  };

  useEffect(() => {
    if (selectedDirectory) {
      getSubDirectories(selectedDirectory);
    }
  }, [selectedDirectory]);

  const handleConfirmMove = () => {
    if (selectedDirectory && selectedSubdirectory) {
      onMoveConfirm(selectedDirectory, selectedSubdirectory);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("Choose Destination")}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>{t("Select Directory")}</InputLabel>
          <Select
            value={selectedDirectory}
            onChange={(e) => setSelectedDirectory(e.target.value)}
          >
            {directories.map((directory) => (
              <MenuItem key={directory} value={directory}>
                {directory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedDirectory && (
          <FormControl fullWidth>
            <InputLabel>{t("Select Subdirectory")}</InputLabel>
            <Select
              value={selectedSubdirectory}
              onChange={(e) => setSelectedSubdirectory(e.target.value)}
            >
              {subdirectories.map((subdirectory) => (
                <MenuItem key={subdirectory} value={subdirectory}>
                  {subdirectory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Cancel")}</Button>
        <Button onClick={handleConfirmMove} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DestinationChooser;
