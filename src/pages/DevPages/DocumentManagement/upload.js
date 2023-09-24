import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import API_BASE_URL from "./apiConfig";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  textArea: {
    margin: theme.spacing(2),
    maxWidth: 300,
  },
  fileInput: {
    margin: theme.spacing(2),
  },
}));

const KeywordUploader = () => {
    const {t} = useTranslation();
    const classes = useStyles();
    const [keywords, setKeywords] = useState(['', '', '', '', '', '']);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
  
    const handleChangeKeywords = (index, value) => {
      const updatedKeywords = [...keywords];
      updatedKeywords[index] = value;
      setKeywords(updatedKeywords);
      setError(''); // Clear error message when a keyword is entered
    };
  
    const handleFileInputChange = (event) => {
      const selectedFiles = event.target.files;
      setFiles(selectedFiles);
    };
  
    const handleUploadFiles = async () => {
      if (!keywords.some((keyword) => keyword.trim() !== '')) {
        setError(t('Please enter at least one keyword.'));
        return;
      }
      try {
        const formData = new FormData();
        const keywordsArray = keywords.filter(Boolean).map((keyword) => keyword.trim());
        formData.append('keywords', JSON.stringify(keywordsArray));
  
        Array.from(files).forEach((file, index) => {
          formData.append('files', file);
        });
  
        const response = await axios.post(`${API_BASE_URL}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setResponseMessage(response.data); // Update the response message
        setError(''); // Clear any previous error messages
      } catch (error) {
        console.error(error);
        setError(t('Error uploading files.')); // Update the error message
      }
    };

  return (
    <div className={classes.root}>
      {keywords.map((keyword, index) => (
        <TextField
          key={index}
          className={classes.textArea}
          value={keyword}
          onChange={(e) => handleChangeKeywords(index, e.target.value)}
          label={`Keyword ${index + 1}`}
          variant="outlined"
          size="small"
          maxLength={100}
        />
      ))}
      <div className={classes.fileInput}>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileInputChange}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUploadFiles}
        disabled={!keywords.some((keyword) => keyword.trim() !== '')}
      >
        {t("Upload Files and Keywords")}
      </Button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default KeywordUploader;