import React, { useState } from "react";
import {
  Card,
  Stack,
  Button,
  Container,
  TextField,
  Chip,
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import { useTranslation } from "react-i18next";

const UploadFilesComponent = ({ destination }) => {
  const {t} = useTranslation();
  console.log("Checking prop",destination);
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [files, setFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleKeywordInputChange = (event) => {
    setKeywordInput(event.target.value);
  };

  const handleKeywordInputEnter = (event) => {
    if (event.key === "Enter" && keywordInput.trim() !== "") {
      event.preventDefault(); // Prevent the default behavior of the Enter key
      if (keywords.length < 6) {
        setKeywords([...keywords, keywordInput.trim()]);
        setKeywordInput("");
      }
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setKeywords(keywords.filter((kw) => kw !== keyword));
  };

  const handleFileUpload = (event) => {
    const selectedFiles = event.target.files;
    // Ensure only PDF files are accepted
    const pdfFiles = Array.from(selectedFiles).filter(
      (file) => file.type === "application/pdf"
    );

    // Ensure the number of files does not exceed 100
    const limitedFiles = pdfFiles.slice(0, 100);

    setFiles(limitedFiles);
  };
  destination = './files/'+destination;
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      const keywordsArray = keywords.filter(Boolean).map((keyword) => keyword.trim());
      formData.append('keywords', JSON.stringify(keywordsArray));
      formData.append('destination',destination);
    console.log("Sent ",formData.destination);
      // Append each file to the FormData with the same field name "files"
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await axios.post(`${API_BASE_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear any previous error messages
      setErrorMessage("");
      // Show success message
      setSuccessMessage("Files uploaded successfully!");

      // ... (handle any further actions after successful upload)
      window.location.reload()

    } catch (error) {
      console.error(error);

      // Clear any previous success messages
      setSuccessMessage("");
      // Show error message
      setErrorMessage(t("Error occurred while uploading files. Please try again later."));
    }
  };

  return (
    <Card>
      <Container>
        <Stack spacing={2}>
          <TextField
            label="Keywords"
            variant="outlined"
            value={keywordInput}
            onChange={handleKeywordInputChange}
            onKeyPress={handleKeywordInputEnter}
            disabled={keywords.length >= 6}
            helperText={`Keywords: ${keywords.length}/6`}
          />
          <Stack direction="row" spacing={1}>
            {keywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                onDelete={() => handleRemoveKeyword(keyword)}
              />
            ))}
          </Stack>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
          />
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={files.length === 0 || keywords.length < 4}
          >
            {t("Upload Files")}
          </Button>
          {successMessage && <div>{successMessage}</div>}
          {errorMessage && <div>{errorMessage}</div>}
        </Stack>
      </Container>
    </Card>
  );
};

export default UploadFilesComponent;
