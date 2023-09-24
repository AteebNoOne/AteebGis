import React from "react";
import { Button } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import downloadFile from "./downloadutil"; // Import the downloadFile function from the utility file
import { useTranslation } from "react-i18next";

const DownloadButton = ({ directory, subfolder, filename }) => {
  const {t} = useTranslation();
  const handleFileDownload = () => {
    downloadFile(directory, subfolder, filename);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleFileDownload}>
      <DescriptionIcon />
      {t("Download")}
    </Button>
  );
};

export default DownloadButton;
